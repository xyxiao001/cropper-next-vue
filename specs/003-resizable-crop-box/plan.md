# 实施计划：可缩放裁剪框

**分支**：`codex/feature-planning` | **日期**：2026-08-21 | **规格**：[spec.md](./spec.md)

**输入**：`specs/003-resizable-crop-box/spec.md` 中已确认的功能规格。

## 摘要

新增默认关闭的 `cropBoxResizable` 公开参数。开启后在可见裁剪框上渲染四边和四角共八个控制区；三等分九宫格只在缩放会话中显示，松手后渐隐。通过独立缩放会话在容器坐标系内原子更新位置和尺寸。裁剪框增加独立的连续边框视觉层，四角 L 形和四边短线直接贴合边界，同时保留现有命中范围。首页体验区默认开启该参数，但组件默认值继续为 `false`。

## 技术背景

**语言/版本**：TypeScript 5.9、Vue 3.5，Node.js >=22

**主要依赖**：Vue Composition API；项目现有触摸、裁剪渲染和边界计算模块；Element Plus 仅用于文档 Demo

**存储**：不适用，状态仅存在于组件实例中

**测试**：Vitest 4、Vue Test Utils、jsdom

**目标平台**：支持鼠标和触摸事件的现代桌面及移动浏览器

**项目类型**：Vue 3 npm 组件库及配套文档站

**性能目标**：裁剪框在连续拖动中每次输入均更新可见几何状态；结构化事件继续按现有动画帧队列合并

**约束**：默认行为必须兼容；不改变图片坐标系、图片缩放速度、现有移动手势、双指手势、导出参数或回弹时长

**范围**：一个公开 prop、八方向缩放交互、九宫格和控制区视觉、现有数据链路接入、单元测试、中英文文档、首页体验区和全功能 Demo

## 章程检查

*门禁：Phase 0 前检查，并在 Phase 1 设计完成后复查。*

- **严格控制需求范围**：通过。计划只覆盖八方向自由缩放、九宫格、控制区视觉、首页演示默认值、边界、事件、回弹、重置和文档；不加入九宫格独立开关、比例锁定、可配置最小尺寸、键盘微调或新的移动开关。
- **保持公开 API 兼容**：通过。新 prop 默认 `false`，关闭时不渲染控制点且不改变现有事件和手势。
- **保证裁剪几何与交互正确**：通过。所有裁剪框计算使用容器坐标系；图片仍使用现有左上角坐标约定；仅验证规格点名的鼠标、单指、`centerBox` 组合。
- **测试和文档同步**：通过。计划包含纯几何测试、交互测试、九宫格显示契约、组件回归测试、中英文 README/指南/参数/方法说明、首页体验区和全功能 Demo。
- **先规格后实现**：通过。`spec.md` 已于 2026-08-21 获得用户确认；本计划等待确认后再生成任务和实施。

**Phase 1 复查**：设计没有引入章程例外，全部门禁继续通过。

## 技术设计

### 1. 公开入口

- 在 `lib/vue-cropper.vue` 增加可选布尔 prop `cropBoxResizable`，默认 `false`。
- 只在图片已加载、裁剪框可见且该 prop 为 `true` 时渲染八个缩放控制点。
- 不新增事件、实例方法或对外状态结构；继续使用现有 `change`、`real-time`、导出方法和 `getCropCoordinates()`。

### 2. 缩放几何

- 新建 `lib/composables/useCropResize.ts`，集中保存缩放会话和八方向几何计算。
- 会话开始时记录起始指针、起始裁剪框 `x/y/width/height` 和方向；后续移动始终基于该快照计算，避免累计误差。
- `right/bottom` 方向只改变宽高；`left/top` 方向同时改变坐标和宽高，以保持对边固定；角方向组合对应的横纵规则。
- 每次结果都限制在 `0..wrapper.width/height` 内，并使用内部固定的 `24px` 最小交互尺寸保证正宽高和控制点可继续操作；该尺寸不形成公开配置。
- 一次移动同时写入裁剪框位置和尺寸，再通过现有队列触发状态与实时预览，避免中间不一致状态。

### 3. 手势隔离和生命周期

- 控制点使用独立的鼠标和触摸起始处理，并在起始事件阻止传播，避免触发裁剪框整体移动或图片拖拽。
- 一个缩放会话只追踪主鼠标或第一根触摸点；现有裁剪区双指手势仍用于图片缩放。
- 开始缩放时取消待执行的图片回弹；移动期间不执行 `reboundImg()`；松手或触摸结束时清理窗口监听并执行一次回弹。
- 组件卸载时清理未结束的缩放会话监听。

### 4. watcher 与现有链路

- 增加内部 `cropResizing` 状态，使 `cropLayoutStyle` watcher 在缩放期间仍刷新裁剪框，但跳过图片回弹。
- 缩放结束后，如果 `centerBox` 开启，复用现有 `reboundImg()` 及其时长；关闭时该函数保持现有无操作语义。
- `reset()` 继续把内部裁剪尺寸恢复为最新 `cropLayout` prop 并重新居中，不增加分支。
- `effectiveCropLayoutStyle` 和 `cropAxis` 仍是导出、状态、实时预览和原图坐标的唯一数据源，因此不复制第二套结果计算。

### 5. 视觉和 Demo

- 在裁剪框内部渲染两条横向、两条纵向参考线；参考线不接收指针事件，通过现有 `cropResizing` 状态在会话开始时显示，并在会话结束后以约 `400ms` 透明度过渡淡出。
- 增加独立的裁剪框视觉边框层，避免内容层和蒙层遮挡边框；边框始终位于裁剪内容上方且不接收指针事件。
- 在 `lib/styles/index.scss` 保留八个 `24px` 命中区，将四角 L 形放在裁剪框外侧并使转角紧贴角点，四边短线与对应边界重合；边框、控制区和九宫格复用 `cropColor`。
- 在 `src/pages/Home.vue` 增加裁剪框缩放开关，演示状态默认开启并传入首页裁剪器；不修改组件 prop 默认值。
- 在 `src/pages/DemoAll.vue` 保留现有开关，开启后同步展示新九宫格和控制区视觉。

### 6. 文档审查

- 更新 `README.md` 的中英文能力列表与可选示例。
- 更新 `src/pages/Guide.md`，移除“只支持固定裁剪框”的过时结论并补充可选缩放能力。
- 更新 `src/pages/Props.md` 的九宫格触发与渐隐行为、八方向和首页演示说明。
- 更新 `src/pages/Methods.md`，明确缺失的是旧版生命周期方法，而不是可缩放裁剪框能力。

## 项目结构

### 本功能文档

```text
specs/003-resizable-crop-box/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── vue-cropper-api.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### 源码

```text
lib/
├── vue-cropper.vue
├── interface.ts
├── styles/index.scss
└── composables/
    ├── useCropResize.ts
    ├── useCropperWatchers.ts
    ├── useCropLayout.ts
    └── useInteractions.ts

src/pages/
├── Home.vue
├── Guide.md
├── Methods.md
├── Props.md
└── DemoAll.vue

README.md

tests/
├── useCropResize.test.ts
├── useInteractions.test.ts
└── vue-cropper.test.ts
```

**结构决策**：保持现有单组件库结构。缩放会话和纯几何放入新的组合式模块；九宫格直接属于现有裁剪框视觉层；公开入口、现有 watcher、样式、首页和文档只做接线与说明更新，不重构其他裁剪模块。

## 复杂度跟踪

无章程违规，不需要例外说明。
