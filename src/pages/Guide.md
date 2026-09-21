<LangBlock lang="zh">

# 你的第一张裁剪图。

提供一张图片，调整你想保留的区域，再获取裁剪结果。这个示例使用 Vue 3 和公开的 `cropper-next-vue` 包。

<h2 id="installation">1. 安装组件</h2>

在已有的 Vue 3 项目中安装：

```bash
pnpm add cropper-next-vue
# 或 npm install cropper-next-vue
# 或 yarn add cropper-next-vue
```

<h2 id="first-crop">2. 放入图片</h2>

将自己的图片放在项目的 `public/photo.jpg`，或使用示例中的文件选择按钮。复制下面的完整内容到一个 Vue 组件，即可显示裁剪工作区。

- **拖动图片**：选择想保留的位置。
- **滚轮或双指缩放**：调整图片在选区中的大小。
- **点击 Export image**：在下方看到实际导出结果。

> 组件样式需要单独引入。示例使用容器宽度的 60% 作为选区宽度，裁剪框尺寸与最终输出像素可能不同。

</LangBlock>
<LangBlock lang="en">

# Your first cropped image.

Provide an image, adjust the selection, and export the result. This example uses Vue 3 and the public `cropper-next-vue` package.

<h2 id="installation">1. Install</h2>

Install in an existing Vue 3 project:

```bash
pnpm add cropper-next-vue
# or npm install cropper-next-vue
# or yarn add cropper-next-vue
```

<h2 id="first-crop">2. Add an image</h2>

Place your image at `public/photo.jpg`, or use the file picker in the example. Copy the complete code below into a Vue component to display the workspace.

- **Drag the image** to choose the area to keep.
- **Scroll or pinch** to change its scale inside the selection.
- **Click Export image** to see the actual result below the editor.

> Import the component stylesheet separately. This example uses 60% of the wrapper width for the selection. Display size and export pixels may differ.

</LangBlock>

<ScenarioCodeExample :title="isEn ? 'Complete App.vue' : '完整 App.vue 示例'" :code="code" :copy-label="isEn ? 'Copy code' : '复制代码'" :copied-label="isEn ? 'Copied' : '已复制'" />

<LangBlock lang="zh">

<h2 id="export-result">3. 获取结果</h2>

`getCropBlob()` 返回真实的图片 Blob。示例将它转成临时地址显示出来；接入业务时，可以把同一个 Blob 加入 `FormData` 并提交到你自己的上传接口。

需要 base64 时使用 `getCropData()`。输出格式由 `outputType` 决定，默认为 PNG。

[立即体验基础裁剪](#/demo-basic) · [理解导出尺寸与质量](#/demo-export)

<h2 id="understand">接下来，理解你的选区</h2>

组件默认允许图片拖动和缩放，裁剪框缩放默认关闭。需要调整选区大小时开启 `cropBoxResizable`；需要固定比例时，同时显式启用 `cropBoxConstraintsEnabled` 并设置 `cropAspectRatio`。

[认识容器、图片与裁剪框](#/concepts) · [尝试头像上传](#/scenario-avatar) · [打开完整工作台](#/demo-all)

<h2 id="global-registration">可选：全局注册</h2>

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

createApp(App).use(CropperNextVue).mount('#app')
```

<h2 id="contributing">开发文档站</h2>

仅在维护本仓库时使用以下命令。需要 Node.js ≥22 和 pnpm 9.15.9。

```bash
pnpm run dev
pnpm run build:lib
pnpm run build:docs
```

</LangBlock>
<LangBlock lang="en">

<h2 id="export-result">3. Get the result</h2>

`getCropBlob()` returns an image Blob. The example creates a temporary URL to display it. For your application, add the same Blob to `FormData` and submit it to your own upload endpoint.

Use `getCropData()` for base64. `outputType` sets the export format; the default is PNG.

[Try basic cropping](#/demo-basic) · [Understand export size and quality](#/demo-export)

<h2 id="understand">Next, understand your selection</h2>

Dragging and zooming the image are enabled by default. Resizing the crop box is off by default. Enable `cropBoxResizable` to resize it; for a fixed ratio, also enable `cropBoxConstraintsEnabled` and set `cropAspectRatio`.

[Workspace, image and crop box](#/concepts) · [Try profile photos](#/scenario-avatar) · [Open the playground](#/demo-all)

<h2 id="global-registration">Optional: global registration</h2>

```ts
import { createApp } from 'vue'
import App from './App.vue'
import CropperNextVue from 'cropper-next-vue'
import 'cropper-next-vue/style.css'

createApp(App).use(CropperNextVue).mount('#app')
```

<h2 id="contributing">Working on this documentation</h2>

These commands are for repository contributors. Use Node.js ≥22 and pnpm 9.15.9.

```bash
pnpm run dev
pnpm run build:lib
pnpm run build:docs
```

</LangBlock>
<script setup>
import ScenarioCodeExample from '../components/ScenarioCodeExample.vue'
import code from '../examples/BasicCrop.vue?raw'
import { useLocale } from '../composables/useLocale'
const { isEn } = useLocale()
</script>
