# Implementation Plan: 文档站体验重构

**Branch**: `codex/main-dev-20260921-2` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Status**: Confirmed — 用户在具体设计稿和计划确认请求后要求“统一”，按该方向统一全站并实施。

## Summary

以“看见效果 → 完成首次裁剪 → 理解概念 → 场景接入 → 查阅 API”为学习路径，重构现有文档站。使用统一的暖白与深绿视觉、裁剪角标与细网格、强调图像的首页、适合阅读的文档布局，以及宽画布工作台。

[design-preview.html](./design-preview.html) 是可切换首页、文档、工作台的视觉设计稿。它不替代实际组件实现，画布与部分控件明确为示意。正式页面接回既有裁剪组件和真实导出结果。

保留 Vue、Vite、Markdown、现有语言状态与全部旧路由。新建轻量文档布局、导航元数据和可独立运行的接入示例；不迁移文档框架，不修改 `lib/`。

## Technical Context

**Language/Version**: TypeScript 5.9、Vue 3.5、SCSS；Node.js >=22、pnpm 9.15.9。

**Primary Dependencies**: 现有 Vite 7、Vue Router 5、Element Plus、unplugin-vue-markdown、markdown-it、highlight.js；不新增运行依赖。

**Storage**: 沿用 `cropper-next-vue-doc-locale` 语言偏好；不增加存储。

**Testing**: Vitest + Vue Test Utils；`pnpm run typecheck`；`pnpm run build:docs`；浏览器覆盖中文/英文与 375/768/1440px。

**Target Platform**: 桌面及移动浏览器。

**Project Type**: Vue 组件库内的文档与示例 SPA。

**Performance Goals**: 保留路由懒加载；首页只挂载一份交互裁剪器；不为装饰重复解码图片或添加持续动画。学习效果用 spec 的读者验收衡量，不虚构性能数字。

**Constraints**: 全部既有 20 个路由仍直接可用；30 props、16 methods、5 事件名和已有插槽全部有说明；保留图片来源、请求时机、异常处理、公开行为；默认不执行 lint。

**Scale/Scope**: 改造 20 个既有页面，新增 1 个核心概念页；首页、正文、场景、工作台共用视觉规范。

## Constitution Check

研究前：

- 范围：仅文档结构、视觉、讲解与示例呈现，符合已确认规格。
- 公开 API：`lib/`、包入口、默认值、类型和裁剪行为不改。
- 几何行为：继续使用现有组件，不重新实现缩放、旋转、约束或导出算法。
- 验证：新增文档交互补直接回归测试；文档构建与浏览器检查必需，不执行 lint。
- 流程：spec 已确认；本 plan 已确认，进入 tasks 与站点实现。

设计后复核：上述约束保持成立，无需例外。类型差异只在 audit 中记录。无 `.specify/extensions.yml`，before_plan / after_plan 无待执行 hook。

## Project Structure

### Documentation (this feature)

```text
specs/005-docs-experience-redesign/
├── audit.md
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── design-preview.html
├── quickstart.md
├── contracts/docs-experience.md
└── checklists/requirements.md
```

### Source Code (planned)

```text
src/
├── App.vue                         # 全站头部与三种路由布局组合
├── main.ts                         # 保留路由，新增核心概念路由
├── assets/
│   ├── tokens.scss                 # 颜色、字体、间距与层级
│   └── index.scss                  # 文档排版、代码、表格、控件统一样式
├── docs/
│   ├── navigation.ts               # 双语标题、分组、布局、目录和相邻页
│   └── examples.ts                 # 主题与独立示例原文的对应关系
├── components/
│   ├── SiteHeader.vue              # 品牌、主要导航、语言、外部入口
│   ├── SideBar.vue                 # 消费统一元数据，含移动导航
│   ├── DocLayout.vue               # 正文、页内目录与上下篇
│   ├── PageOutline.vue             # 章节链接
│   ├── Demo.vue                    # 统一示例外壳与代码操作
│   ├── ScenarioCodeExample.vue     # 公共代码工具栏
│   ├── LocaleSwitch.vue            # 保留语言行为，更新呈现
│   ├── DemoImageSwitch.vue         # 保留图片行为，更新呈现
│   └── CropExportPanel.vue         # 保留真实结果与导出行为，更新呈现
├── examples/                       # 供文档展示/复制/编译校验的完整 SFC
│   ├── BasicCrop.vue
│   ├── AvatarCrop.vue
│   ├── CoverCrop.vue
│   ├── ProductCrop.vue
│   └── ...                        # 对应各功能示例，拆任务时列齐
└── pages/
    ├── Home.vue
    ├── Concepts.vue                # 新增核心概念讲解
    ├── Guide.md / Props.md / Methods.md / Event.md / Changelog.md
    ├── ScenarioAvatar.vue / ScenarioCover.vue / ScenarioProduct.vue
    ├── DemoAll.vue / DemoGeometry.vue
    └── Demo*.md
md.config.ts                        # 如统一示例传参需要，限定改动 demo 容器
index.html                          # 按需整理现有外部 Markdown 样式依赖
tests/docs-navigation.test.ts
 tests/docs-interactions.test.ts
 tests/docs-examples.test.ts
```

**Structure Decision**: 不新增第二个站点或构建系统。文档层抽取共享规则，功能演示继续由现有页面和库组件承担。上述新增文件为计划清单，尚未实施。

## Visual Design

- 底色 `#F7F8F4`，正文 `#1B3029`，次级正文使用经对比度核对的灰绿色，主色 `#24674F`，细边线 `#DFE5DC`，浅绿提示区；不依赖颜色单独传达状态。
- 沿用系统中英文字体与等宽代码字体；正式文档正文 15–16px、行高约 1.8，辅助文字不小于 12px。设计稿部分密度较高的微型英文标签仅用于方向展示，实现时保证可读性。
- 桌面首页最大宽约 1240px，标题与画布双栏；主操作为开始接入，次操作为在线体验。实际交互画布保持正向、不应用倾斜变换，确保坐标与指针一致。设计稿的轻微倾斜仅为静态视觉探索。
- 桌面文档采用约 220px 侧栏、可读宽度正文、约 160px 本页目录；工作台取消右侧阅读目录，保留编辑画布与配置面板。
- 375px 单栏；侧栏通过现有移动导航模式访问，本页目录折叠展示；768px 根据可用宽度保留主要内容，1440px 展示完整三栏。
- 使用裁剪角标和网格作为局部图形语言。首页场景卡片使用现有素材展示，不更换图片来源。
- 统一按钮、代码工具栏、注释、表格和预览结果区域；不在画布上覆盖阻碍拖拽的装饰。

## Page and Content Design

1. `Home.vue`：首屏产品定位 + 一份真实裁剪演示；核心操作就近呈现，详细配置进入现有工作台。演示配置标明与库默认值的差异；场景卡片链接三个现有场景。
2. `Guide.md`：安装、完整 SFC、图片说明、操作与可见导出结果；仓库维护命令放在次要开发说明区。
3. `Concepts.vue`：容器/图片/裁剪框的标注图，解释显示尺寸与输出像素；布局与边界、比例约束、预览与状态/坐标分别链接现有主题示例。
4. API：Props 分为六组；方法按输出、几何、缩放、重置组织；事件按加载、预览、状态组织。修正已核实的边界、导出返回类型与尺寸解释。
5. 各示例：用途、预期变化、实际演示、完整接入代码、相关参考统一顺序。显示的接入代码不暴露文档站私有组件。
6. 场景：保留已有选择图片和本地结果流程；代码示例加入公开组件及样式导入，先给独立可运行的本地裁剪导出。业务上传扩展单独标明由使用者提供服务。
7. 工作台：保留四类能力（编辑、导出、方法、数据），用视觉分组和提示解释参数。设计稿省略的功能不得在实际重构中丢失。

## Navigation and Content Mechanics

- `navigation.ts` 统一管理路径、双语标题、分组、布局、本页章节和关联内容；懒加载仍由路由负责。
- 长页使用稳定、语言无关的显式章节 ID；两种语言使用同一 ID。页内跳转使用 `{ path, hash }`，避免裸片段覆盖 hash 路由。
- 保留应用滚动容器；在路由组件及语言内容挂载后定位目标章节。挂载完成钩子负责一次定位，不增加轮询或自动重试。
- 上/下一篇取学习序列，而非从路由声明顺序推断。
- 独立示例放在 `src/examples/`，以 `?raw` 展示同一份代码。保留现有演示运行逻辑；编译验证复制示例，避免仅检查字符串。
- 继续使用 `useLocale` 和 `LangBlock`；集中公共按钮标签，不引入翻译缺失兜底。

## Implementation Sequence (待确认后拆任务)

1. 视觉基础、统一导航与布局。
2. 首页、快速开始和核心概念。
3. 示例外壳、独立接入代码、API 重组与准确性修订。
4. 三类场景、工作台、其余示例和版本记录统一呈现。
5. 回归测试、类型检查、文档构建、浏览器验收、converge。

## Verification

- 最小自动化：原 20 路由覆盖与元数据关系；双语章节定位；代码工具栏键盘/复制行为；独立示例编译与最小导出接入。
- 命令：`pnpm run typecheck`、`pnpm exec vitest run tests/docs-navigation.test.ts tests/docs-interactions.test.ts tests/docs-examples.test.ts`、`pnpm run build:docs`、`git diff --check`。
- 不改库逻辑，因此本计划不要求全库 check；若实际实施出现库改动应停止并重新核定范围。
- 浏览器：375/768/1440px 的全部页面阅读与溢出，重点验证首页、快速开始、边界/比例/导出、三类场景、工作台中英操作，查看实际导出结果。
- 真实读者测试单独记录，未实施时标记待验收，不用代理浏览器测试代替。

## Risks

- hash 路由与章节片段组合、懒加载和语言切换的 DOM 更新时机。
- 全局 Markdown/Element Plus 样式覆盖可能影响示例控件；以文档命名空间和主题变量控制，避免覆盖库内部选择器。
- 桌面画布到窄屏的展示尺寸调整不得改成新的几何规则；仅使用库已有尺寸能力。
- 可复制代码与站内运行示例双轨存在维护成本；以独立代码资产与契约测试明确各自用途。
