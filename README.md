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
- 高分屏导出
- 实时预览
- 独立的 npm 包构建
- 独立的文档站构建

在线预览：

- [https://cropper-next-vue.vercel.app/](https://cropper-next-vue.vercel.app/)

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
pnpm run release:npm -- 0.2.0
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
- high-DPI export
- realtime preview
- standalone npm package output
- standalone docs site output

Live preview:

- [https://cropper-next-vue.vercel.app/](https://cropper-next-vue.vercel.app/)

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
pnpm run release:npm -- 0.2.0
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
