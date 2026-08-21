# 实现计划：图片编辑与原图几何

**功能目录**：`002-image-edit-geometry` | **日期**：2026-08-20 | **规格**：[spec.md](./spec.md)

## 概要

新增绝对缩放上下限、相对屏幕方向的水平/垂直翻转，以及同步读取原图裁剪几何的公开能力。实现沿用当前布局容器：统一收口缩放值计算，在图片状态中加入翻转布尔值，复用同一变换语义生成主视图、裁剪预览和导出，并通过纯几何函数把裁剪框四角反向映射到方向校正后的源图坐标。

## 技术背景

**语言与版本**：TypeScript 5.9、Vue 3.5，Node.js `>=22`

**主要依赖**：Vue 3、浏览器 Canvas 2D、Vite 7

**存储**：无持久化存储，状态保存在组件响应式布局容器中

**测试**：Vitest 4、Vue Test Utils、jsdom

**目标平台**：现代桌面与移动浏览器、Vue 3 应用

**项目类型**：可发布的 Vue 组件库及配套文档站

**性能目标**：缩放与翻转保持当前逐帧交互性能；坐标读取只执行固定数量的点变换，不创建画布、不解码图片

**约束**：默认值保持现有行为；边界覆盖要求优先于冲突的缩放上限；翻转相对屏幕坐标轴；原图坐标以方向校正后的源 canvas 为基准

**范围**：2 个 props、2 个翻转方法、1 个坐标读取方法、`change` 状态扩展、预览/导出同步、文档示例和回归测试

## 章程检查

- [x] 范围仅包含用户确认的三个 P1 功能及其必需的状态、预览、导出和文档同步。
- [x] `minScale=0.01`、`maxScale=Infinity` 且未调用翻转方法时保持现有公开行为。
- [x] 坐标系已明确：`imgAxis.x/y` 仍表示缩放后未旋转矩形左上角；翻转以显示中心为原点并相对屏幕轴执行。
- [x] 不新增无效缩放配置校验、自动纠正、状态恢复输入、撤销栈或 EXIF 原始字节坐标。
- [x] 计划包含纯几何单元测试、组件合同测试、导出测试、`pnpm run check` 和文档站构建。

阶段 1 设计复核结果：通过，无章程例外。

## 设计决策

### 统一缩放范围

所有缩放入口在改变布局前调用同一范围计算。配置范围为 `[minScale, maxScale]`；启用边界限制时，先计算覆盖裁剪框或容器所需比例 `boundaryMin`，得到：

- `effectiveMin = max(minScale, boundaryMin)`
- `effectiveMax = max(maxScale, effectiveMin)`

请求比例被限制到有效范围后再计算中心或指针锚点。若请求越界后仍等于当前比例，则不改变位置。初始布局与 `reset()` 先应用配置范围，再由现有边界回弹入口落实有效范围。

### 屏幕方向翻转

图片状态增加 `flipX`、`flipY`。CSS 变换保持现有缩放与位移顺序，在位移和旋转之间加入翻转矩阵，使翻转轴固定为屏幕水平/垂直方向，位移不被反向。Canvas 导出在画布中心依次应用屏幕翻转和旋转，确保主视图、裁剪预览、实时预览和导出含义一致。

### 原图裁剪几何

裁剪框四角以容器坐标表示。对每个点：

1. 减去图片显示中心并除以当前比例；
2. 按 `flipX` / `flipY` 逆向翻转；
3. 应用当前旋转角的逆旋转；
4. 加回源图中心。

结果按裁剪框左上、右上、右下、左下顺序返回，同时计算不裁边的外接矩形。读取函数为纯同步计算，不进入事件或导出队列。

## 项目结构

```text
specs/002-image-edit-geometry/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── vue-cropper-api.md
└── tasks.md

lib/
├── interface.ts                         # 翻转状态与原图几何类型
├── common.ts                            # CSS/Canvas 统一翻转语义与导出
├── vue-cropper.vue                      # props、方法和依赖装配
└── composables/
    ├── state.ts                         # 图片翻转初始状态
    ├── useScaleLimits.ts                # 配置范围与边界有效范围
    ├── useCropCoordinates.ts            # 原图四角反向映射
    ├── useInteractions.ts               # 用户缩放限制
    ├── useImagePipeline.ts              # 初始布局和 reset 缩放限制
    ├── usePublicMethods.ts              # 公开缩放、翻转和坐标读取方法
    ├── useCropState.ts                  # change 翻转字段
    ├── useRealTime.ts                   # 实时预览翻转
    ├── useCropRender.ts                 # 裁剪框预览翻转
    └── useExport.ts                     # 导出传递完整变换状态

src/pages/
├── Props.md
├── Methods.md
├── Event.md
└── DemoAll.md

tests/
├── useScaleLimits.test.ts
├── useCropCoordinates.test.ts
├── useInteractions.test.ts
├── common.test.ts
└── vue-cropper.test.ts
```

**结构选择**：保持现有单组件库结构，只新增两个纯职责 composable；不引入第三方矩阵库或新的状态层。

## 复杂度跟踪

无章程违规或需要额外说明的复杂度。
