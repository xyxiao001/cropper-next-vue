# cropper-next-vue

![license](https://img.shields.io/badge/license-ISC-blue.svg)
![node](https://img.shields.io/badge/node-22.x-339933.svg)
![coverage](https://img.shields.io/badge/coverage-%E2%89%A570%25-brightgreen.svg)
![tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

[中文](#中文) | [English](#english)

## 中文

`cropper-next-vue` 是一个独立发布的 Vue 3 图片裁剪库，重点处理这些能力：

- 图片旋转后的边界判断
- 图片限制在截图框内或容器内
- 可选的八方向裁剪框缩放，支持固定比例和最小/最大尺寸，调整时显示九宫格构图参考
- 鼠标位置/双指中心缩放、缩放上下限，以及独立的移动和交互缩放开关
- 水平/垂直翻转、原图裁剪坐标、结构化 `change` 状态事件和无重新加载的 `reset()`
- 高分屏导出
- 实时预览
- 独立的 npm 包构建
- 独立的文档站构建

在线预览：

- [https://cropper-next-vue.vercel.app/](https://cropper-next-vue.vercel.app/)

### 最近更新

`0.4.0` 新增结构化裁剪状态、重置、交互开关、缩放上下限、图片翻转、原图裁剪坐标，以及带比例和尺寸限制的可缩放裁剪框。

### 安装

推荐使用 pnpm：

```bash
pnpm add cropper-next-vue
```

```bash
npm install cropper-next-vue
```

```bash
yarn add cropper-next-vue
```

### 使用

组件内引入：

```ts
import 'cropper-next-vue/style.css'
import { VueCropper } from 'cropper-next-vue'
```

全局注册：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const app = createApp(App)
app.use(CropperNextVue)
app.mount('#app')
```

基础示例：

```vue
<template>
  <VueCropper
    :img="img"
    :crop-layout="{ width: 200, height: 200 }"
    :center-box="true"
    :crop-box-resizable="true"
    :crop-box-constraints-enabled="true"
    :crop-aspect-ratio="4 / 3"
    :min-crop-width="160"
    :min-crop-height="120"
    :max-crop-width="640"
    :max-crop-height="480"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const img = ref('https://example.com/demo.jpg')

const handleChange = (state: unknown) => {
  console.log(state)
}
</script>
```

`cropBoxResizable` 默认关闭；开启后可拖动四边和四角调整裁剪框，九宫格只在调整期间显示并在松手后渐隐。`cropBoxConstraintsEnabled` 也默认关闭；开启后，比例和最小/最大尺寸会同时约束用户拖动、初始及运行时 `cropLayout`、`setCropLayout()` 和 `reset()`。运行时从关闭切换为开启时，应用限制后的裁剪框会重新居中；限制开启后的参数更新保留当前位置。`setCropAxis()` 只改变坐标，不受尺寸限制。`cropAspectRatio` 使用“宽度 ÷ 高度”表示；不传时保持自由比例。程序化宽高不符合固定比例时，会在请求范围内取最大的目标比例框。

### 实例方法

通过组件 `ref` 可以调用少量实例方法（导出/旋转/缩放/重载/布局控制）：

```ts
const cropper = ref()

cropper.value?.reload?.()
cropper.value?.reset?.()
cropper.value?.zoomIn?.()
cropper.value?.zoomOut?.()
cropper.value?.changeScale?.(0.1)
cropper.value?.setRotateAngle?.(180)
cropper.value?.flipHorizontal?.()
cropper.value?.flipVertical?.()
cropper.value?.setCropLayout?.({ width: '60%', height: 220 })
cropper.value?.setCropAxis?.({ x: 0, y: 0 })
const coordinates = cropper.value?.getCropCoordinates?.()
const base64 = await cropper.value?.getCropData?.()
const blob = await cropper.value?.getCropBlob?.()
```

`change` 事件会在图片或裁剪框状态变化时提供结构化状态，其中 `image` 包含位置、缩放、旋转和翻转状态，`crop` 包含裁剪框的 `x / y / width / height`。完整参数、事件与方法说明见在线文档中的“参数”“事件”和“方法”页面。

### 实时预览（推荐用法）

业务联动场景建议监听 `@real-time`，并使用回调的 `payload.url + payload.img` 通过 CSS 渲染轻量实时预览（不需要在交互过程中频繁调用 `getCropData()`）：

```vue
<template>
  <VueCropper :img="img" @real-time="handlePreview" />

  <section class="realtime-preview" :style="{ width: w + 'px', height: h + 'px', overflow: 'hidden' }">
    <img v-if="url" :src="url" :style="imgStyle" alt="realtime preview" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const w = ref(0)
const h = ref(0)
const url = ref('')
const imgStyle = ref<{ width: string; height: string; transform: string }>({
  width: '0px',
  height: '0px',
  transform: '',
})

const handlePreview = (payload: any) => {
  w.value = payload.w
  h.value = payload.h
  url.value = payload.url
  imgStyle.value = payload.img
}
</script>
```

说明：

- `realTime` 是 `real-time` 的兼容别名，推荐优先用 `real-time`。
- `payload.html` 字段主要用于兼容/快速调试，不建议业务依赖其结构；如需 `v-html` 渲染请注意注入风险。

### 本地开发

如果你未启用 corepack（Node 16+），可以先执行 `corepack enable`。

```bash
pnpm install

# 文档站开发
pnpm run dev

# 只构建 npm 包
pnpm run build:lib

# 只构建文档站
pnpm run build:docs

# 同时构建 npm 包和文档站
pnpm run build
```

### 质量门

- `pnpm run typecheck`
- `pnpm run test:coverage`
- `pnpm run build:lib`
- `pnpm run check`

其中 `pnpm run check` 会依次执行：typecheck → test:coverage → build:lib。

覆盖率阈值定义在 [vitest.config.ts](./vitest.config.ts)：

- `lines >= 70`
- `functions >= 70`
- `branches >= 60`
- `statements >= 70`

### 构建输出

- npm 包输出到 `dist/`
- 文档站输出到 `docs-dist/`

发布前建议执行：

```bash
pnpm run build:lib
pnpm pack --pack-destination /tmp
```

发布 npm 可直接使用：

```bash
pnpm run release:npm -- patch
pnpm run release:npm -- minor
pnpm run release:npm -- 0.4.0
pnpm run release:npm -- patch --tag next
```

这个脚本会依次执行：

- 更新 `package.json` 版本号
- 运行 `pnpm run check`
- 重新构建 lib 产物
- 发布到 npm

默认要求 git 工作区干净，并且当前机器已经完成 `npm login`。

### 开源协作

- 许可证：`ISC`
- Node 版本要求：`22.x`
- 提交前建议执行：`pnpm run check`
- 贡献说明见 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 行为约定见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## English

`cropper-next-vue` is a standalone Vue 3 image cropper focused on:

- boundary handling after rotation
- keeping the image inside the crop box or wrapper
- optional eight-direction crop-box resizing with aspect-ratio and min/max size constraints, plus a rule-of-thirds grid while resizing
- pointer/pinch-center zoom, scale limits, and independent movement and interactive-zoom switches
- horizontal/vertical flips, source-image crop coordinates, structured `change` state, and reset without reloading
- high-DPI export
- realtime preview
- standalone npm package output
- standalone docs site output

Live preview:

- [https://cropper-next-vue.vercel.app/](https://cropper-next-vue.vercel.app/)

### Latest Update

`0.4.0` adds structured crop state, reset, interaction switches, scale limits, image flips, source crop coordinates, and a resizable crop box with ratio and size constraints.

### Install

Recommended with pnpm:

```bash
pnpm add cropper-next-vue
```

```bash
npm install cropper-next-vue
```

```bash
yarn add cropper-next-vue
```

### Usage

Import inside a component:

```ts
import 'cropper-next-vue/style.css'
import { VueCropper } from 'cropper-next-vue'
```

Global registration:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const app = createApp(App)
app.use(CropperNextVue)
app.mount('#app')
```

Basic example:

```vue
<template>
  <VueCropper
    :img="img"
    :crop-layout="{ width: 200, height: 200 }"
    :center-box="true"
    :crop-box-resizable="true"
    :crop-box-constraints-enabled="true"
    :crop-aspect-ratio="4 / 3"
    :min-crop-width="160"
    :min-crop-height="120"
    :max-crop-width="640"
    :max-crop-height="480"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const img = ref('https://example.com/demo.jpg')

const handleChange = (state: unknown) => {
  console.log(state)
}
</script>
```

`cropBoxResizable` is disabled by default. When enabled, users can resize the crop box from four edges and four corners; the rule-of-thirds grid is shown only while resizing and fades after release. `cropBoxConstraintsEnabled` is also disabled by default. When enabled, the ratio and min/max sizes constrain handle dragging, initial and runtime `cropLayout`, `setCropLayout()`, and `reset()`. Switching constraints from disabled to enabled at runtime recenters the constrained crop box; later constraint updates preserve its position. `setCropAxis()` changes coordinates only and is not size-constrained. `cropAspectRatio` is expressed as `width / height`; omit it for free resizing. When a programmatic size does not match the fixed ratio, the largest target-ratio box inside the requested size is used.

### Instance Methods

A small set of instance methods are exposed through the component `ref` (export/rotation/zoom/reload/layout control):

```ts
const cropper = ref()

cropper.value?.reload?.()
cropper.value?.reset?.()
cropper.value?.zoomIn?.()
cropper.value?.zoomOut?.()
cropper.value?.changeScale?.(0.1)
cropper.value?.setRotateAngle?.(180)
cropper.value?.flipHorizontal?.()
cropper.value?.flipVertical?.()
cropper.value?.setCropLayout?.({ width: '60%', height: 220 })
cropper.value?.setCropAxis?.({ x: 0, y: 0 })
const coordinates = cropper.value?.getCropCoordinates?.()
const base64 = await cropper.value?.getCropData?.()
const blob = await cropper.value?.getCropBlob?.()
```

The `change` event emits structured state whenever the image or crop box changes. Its `image` field contains position, scale, rotation, and flip state; `crop` contains the crop box's `x / y / width / height`. See the online Props, Events, and Methods pages for the complete API.

### Realtime Preview (Recommended)

For realtime UI integration, listen to `@real-time` and render a lightweight live preview with `payload.url + payload.img` (CSS only). This avoids calling `getCropData()` frequently during interactions:

```vue
<template>
  <VueCropper :img="img" @real-time="handlePreview" />

  <section class="realtime-preview" :style="{ width: w + 'px', height: h + 'px', overflow: 'hidden' }">
    <img v-if="url" :src="url" :style="imgStyle" alt="realtime preview" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const w = ref(0)
const h = ref(0)
const url = ref('')
const imgStyle = ref<{ width: string; height: string; transform: string }>({
  width: '0px',
  height: '0px',
  transform: '',
})

const handlePreview = (payload: any) => {
  w.value = payload.w
  h.value = payload.h
  url.value = payload.url
  imgStyle.value = payload.img
}
</script>
```

Notes:

- `realTime` is a compatibility alias of `real-time`. Prefer `real-time` in new code.
- `payload.html` is mainly kept for compatibility / quick debugging. Avoid depending on its structure; if you render it via `v-html`, be aware of injection risks.

### Local development

If corepack is not enabled (Node 16+), run `corepack enable` first.

```bash
pnpm install

# docs dev server
pnpm run dev

# build npm package only
pnpm run build:lib

# build docs site only
pnpm run build:docs

# build both package and docs
pnpm run build
```

### Quality gates

- `pnpm run typecheck`
- `pnpm run test:coverage`
- `pnpm run build:lib`
- `pnpm run check`

`pnpm run check` runs: typecheck → test:coverage → build:lib.

Coverage thresholds are defined in [vitest.config.ts](./vitest.config.ts):

- `lines >= 70`
- `functions >= 70`
- `branches >= 60`
- `statements >= 70`

### Build outputs

- npm package output goes to `dist/`
- docs site output goes to `docs-dist/`

Recommended before publishing:

```bash
pnpm run build:lib
pnpm pack --pack-destination /tmp
```

Release to npm:

```bash
pnpm run release:npm -- patch
pnpm run release:npm -- minor
pnpm run release:npm -- 0.4.0
pnpm run release:npm -- patch --tag next
```

The release script will:

- update the version in `package.json`
- run `pnpm run check`
- rebuild the library output
- publish the package to npm

It requires a clean git working tree and a valid `npm login` session by default.

### Open source collaboration

- License: `ISC`
- Required Node version: `22.x`
- Recommended pre-commit check: `pnpm run check`
- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
