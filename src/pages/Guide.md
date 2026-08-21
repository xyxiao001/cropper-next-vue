<LangBlock lang="zh">

# 快速开始

`cropper-next-vue` 当前更适合这样理解：

- 默认固定、可按需开启八方向缩放的截图框
- 可选开启固定比例和最小/最大裁剪框尺寸限制，并统一作用于交互与程序化尺寸入口
- 图片可拖拽、缩放、旋转
- 支持边界限制
- 调整裁剪框时提供九宫格构图参考，松手后渐隐
- 支持实时预览和高分屏导出

### 安装

```bash
npm install cropper-next-vue
```

```bash
yarn add cropper-next-vue
```

### 使用

`Vue 3` 组件内引入

```ts
import 'cropper-next-vue/style.css'
import { VueCropper } from 'cropper-next-vue'
```

`Vue 3` 全局引入

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const app = createApp(App)
app.use(CropperNextVue)
app.mount('#app')
```

### 本地开发命令

```bash
# 文档站开发
pnpm run dev

# 构建 npm 包
pnpm run build:lib

# 构建文档站
pnpm run build:docs
```

### 推荐阅读路径

如果你第一次接触这个库，建议按这个顺序看文档：

1. [基础例子](#/demo-basic)：先跑通最小裁剪和导出。
2. [导出能力](#/demo-export)：理解 `outputType`、`outputSize`、`full`、`getCropBlob`。
3. [截图框操作](#/demo-crop)：理解八方向缩放、九宫格、比例和尺寸限制。
4. [边界控制](#/demo-img)：理解 `centerBox` 和 `centerWrapper`。
5. [旋转控制](#/demo-rotate)：理解旋转和边界约束的组合。
6. [实时预览](#/demo-realtime)：理解 `real-time`、实例旋转方法和联动预览。
7. [全功能工作台](#/demo-all)：直接组合验证裁剪框比例、尺寸限制、状态、坐标和导出。

### 当前能力边界

当前版本默认保持固定截图框；传入 `:crop-box-resizable="true"` 后，可通过四边和四角调整裁剪框。`cropBoxConstraintsEnabled` 默认关闭；开启后，`cropAspectRatio` 可以固定宽高比，`minCropWidth`、`minCropHeight`、`maxCropWidth` 和 `maxCropHeight` 可以限制实际裁剪框尺寸。拖动控制区时显示九宫格构图参考，松手后渐隐。

```vue
<VueCropper
  :crop-box-resizable="true"
  :crop-box-constraints-enabled="true"
  :crop-aspect-ratio="4 / 3"
  :min-crop-width="160"
  :min-crop-height="120"
  :max-crop-width="640"
  :max-crop-height="480"
/>
```

限制开启后会统一作用于用户拖动、初始及运行时 `cropLayout`、`setCropLayout()` 和 `reset()`，从设置阶段阻止超限尺寸；运行时从关闭切换为开启限制时，应用限制后的裁剪框会重新居中。限制已开启后的比例或尺寸参数更新继续保留当前位置，`setCropAxis()` 也只改变坐标。程序化宽高不符合固定比例时，会在请求范围内取最大的目标比例框。当前版本仍不包含旧版裁剪生命周期 API。

</LangBlock>

<LangBlock lang="en">

# Guide

`cropper-next-vue` is best understood as:

- a crop box that is fixed by default and optionally resizable in eight directions
- optional aspect-ratio and min/max crop-box constraints for both handle dragging and programmatic size entries
- draggable, scalable, and rotatable image editing
- boundary control support
- a rule-of-thirds grid while resizing that fades after release
- realtime preview and high-DPI export support

### Install

```bash
npm install cropper-next-vue
```

```bash
yarn add cropper-next-vue
```

### Usage

Import inside a Vue 3 component:

```ts
import 'cropper-next-vue/style.css'
import { VueCropper } from 'cropper-next-vue'
```

Global registration in Vue 3:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const app = createApp(App)
app.use(CropperNextVue)
app.mount('#app')
```

### Local development commands

```bash
# docs dev server
pnpm run dev

# build npm package
pnpm run build:lib

# build docs site
pnpm run build:docs
```

### Recommended reading order

If this is your first time using the library, this sequence works best:

1. [Basic Demo](#/demo-basic): get the minimal crop and export flow working.
2. [Export](#/demo-export): understand `outputType`, `outputSize`, `full`, and `getCropBlob`.
3. [Crop Box](#/demo-crop): understand eight-direction resizing, the rule-of-thirds grid, ratio, and size constraints.
4. [Boundary](#/demo-img): understand `centerBox` and `centerWrapper`.
5. [Rotation](#/demo-rotate): understand rotation plus boundary constraints.
6. [Realtime Preview](#/demo-realtime): understand `real-time`, rotation methods, and linked preview.
7. [Full-featured Workspace](#/demo-all): combine crop ratio, size limits, state, coordinates, and export.

### Current scope

The crop box remains fixed by default. Pass `:crop-box-resizable="true"` to resize it from four edges and four corners. `cropBoxConstraintsEnabled` is disabled by default. When enabled, use `cropAspectRatio` to keep a fixed ratio and the min/max crop props to constrain the actual crop-box size. A rule-of-thirds grid appears while dragging and fades after release.

```vue
<VueCropper
  :crop-box-resizable="true"
  :crop-box-constraints-enabled="true"
  :crop-aspect-ratio="4 / 3"
  :min-crop-width="160"
  :min-crop-height="120"
  :max-crop-width="640"
  :max-crop-height="480"
/>
```

When enabled, these constraints apply to handle dragging, initial and runtime `cropLayout`, `setCropLayout()`, and `reset()`, preventing oversized programmatic results before the first drag. Switching constraints from disabled to enabled at runtime recenters the constrained crop box. Later ratio or size-limit updates preserve its current position, and `setCropAxis()` changes coordinates only. A programmatic size that does not match the fixed ratio uses the largest target-ratio box inside the requested size. Legacy crop lifecycle APIs remain out of scope.

</LangBlock>
