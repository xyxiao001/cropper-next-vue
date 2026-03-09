# cropper-next-vue

![license](https://img.shields.io/badge/license-ISC-blue.svg)
![node](https://img.shields.io/badge/node-%3E%3D18-339933.svg)
![coverage](https://img.shields.io/badge/coverage-%E2%89%A585%25-brightgreen.svg)
![tests](https://img.shields.io/badge/tests-37%20passing-brightgreen.svg)

[中文](#中文) | [English](#english)

## 中文

`cropper-next-vue` 是一个独立发布的 Vue 3 图片裁剪库，重点处理这些能力：

- 图片旋转后的边界判断
- 图片限制在截图框内或容器内
- 高分屏导出
- 实时预览
- 独立的 npm 包构建
- 独立的文档站构建

### 安装

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
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const img = ref('https://example.com/demo.jpg')
</script>
```

### 本地开发

```bash
# 文档站开发
npm run dev

# 只构建 npm 包
npm run build:lib

# 只构建文档站
npm run build:docs

# 同时构建 npm 包和文档站
npm run build
```

### 质量门

- `npm run typecheck`
- `npm run test:coverage`
- `npm run build:lib`
- `npm run check`

覆盖率阈值定义在 [vitest.config.ts](/Users/bytedance/projects/cropper-next/vitest.config.ts)：

- `lines >= 70`
- `functions >= 70`
- `branches >= 60`
- `statements >= 70`

### 构建输出

- npm 包输出到 `dist/`
- 文档站输出到 `docs-dist/`

发布前建议执行：

```bash
npm run build:lib
npm pack --dry-run
```

### 开源协作

- 许可证：`ISC`
- Node 版本要求：`>=18`
- 提交前建议执行：`npm run check`
- 贡献说明见 [CONTRIBUTING.md](/Users/bytedance/projects/cropper-next/CONTRIBUTING.md)
- 行为约定见 [CODE_OF_CONDUCT.md](/Users/bytedance/projects/cropper-next/CODE_OF_CONDUCT.md)

## English

`cropper-next-vue` is a standalone Vue 3 image cropper focused on:

- boundary handling after rotation
- keeping the image inside the crop box or wrapper
- high-DPI export
- realtime preview
- standalone npm package output
- standalone docs site output

### Install

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
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueCropper } from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

const img = ref('https://example.com/demo.jpg')
</script>
```

### Local development

```bash
# docs dev server
npm run dev

# build npm package only
npm run build:lib

# build docs site only
npm run build:docs

# build both package and docs
npm run build
```

### Quality gates

- `npm run typecheck`
- `npm run test:coverage`
- `npm run build:lib`
- `npm run check`

Coverage thresholds are defined in [vitest.config.ts](/Users/bytedance/projects/cropper-next/vitest.config.ts):

- `lines >= 70`
- `functions >= 70`
- `branches >= 60`
- `statements >= 70`

### Build outputs

- npm package output goes to `dist/`
- docs site output goes to `docs-dist/`

Recommended before publishing:

```bash
npm run build:lib
npm pack --dry-run
```

### Open source collaboration

- License: `ISC`
- Required Node version: `>=18`
- Recommended pre-commit check: `npm run check`
- Contribution guide: [CONTRIBUTING.md](/Users/bytedance/projects/cropper-next/CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](/Users/bytedance/projects/cropper-next/CODE_OF_CONDUCT.md)
