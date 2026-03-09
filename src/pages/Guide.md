<LangBlock lang="zh">

# 快速开始

`cropper-next-vue` 当前更适合这样理解：

- 固定截图框
- 图片可拖拽、缩放、旋转
- 支持边界限制
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
3. [边界控制](#/demo-img)：理解 `centerBox` 和 `centerWrapper`。
4. [旋转控制](#/demo-rotate)：理解旋转和边界约束的组合。
5. [实时预览](#/demo-realtime)：理解 `real-time`、实例旋转方法和联动预览。

### 当前能力边界

当前版本走的是“固定截图框”路线，因此没有旧版那套可缩放裁剪框、八点拖拽和固定比例裁剪框 API。  
如果你的需求重点是旋转后的裁剪、边界控制、导出质量和组件集成，这个版本更合适。

</LangBlock>

<LangBlock lang="en">

# Guide

`cropper-next-vue` is best understood as:

- a fixed crop-box component
- draggable, scalable, and rotatable image editing
- boundary control support
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
3. [Boundary](#/demo-img): understand `centerBox` and `centerWrapper`.
4. [Rotation](#/demo-rotate): understand rotation plus boundary constraints.
5. [Realtime Preview](#/demo-realtime): understand `real-time`, rotation methods, and linked preview.

### Current scope

This version follows a fixed crop-box direction, so it does not include the old resizable crop-box APIs, eight-point resize handles, or fixed-ratio crop-box workflow.  
If your priority is rotated cropping, boundary control, export quality, and Vue integration, this version is a better fit.

</LangBlock>
