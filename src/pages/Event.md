<LangBlock lang="zh">

# 事件

当前版本实际对外触发的事件如下。

名称 | 说明 | 返回值
--- | --- | ---
`img-load` | 图片加载完成或失败时触发 | `{ type: 'success' \| 'error', message: string }`
`img-upload` | 拖拽上传或本地文件读取成功时触发 | `string`
`real-time` | 图片或截图框变化时触发预览数据 | 预览对象
`realTime` | `real-time` 的兼容别名 | 预览对象
`change` | 图片或截图框状态变化时触发 | 完整裁剪状态对象

<h2 id="section-1"><code>img-load</code></h2>

```html
<vue-cropper :img="img" @img-load="handleImgLoad" />
```

```ts
const handleImgLoad = (payload) => {
  console.log(payload.type, payload.message)
}
```

成功时：

```ts
{
  type: 'success',
  message: '图片加载成功'
}
```

失败时：

```ts
{
  type: 'error',
  message: '图片加载失败...'
}
```

<h2 id="section-2"><code>img-upload</code></h2>

```html
<vue-cropper :img="img" @img-upload="handleUpload" />
```

```ts
const handleUpload = (url) => {
  img.value = url
}
```

<h2 id="section-3"><code>real-time</code></h2>

```html
<vue-cropper :img="img" @real-time="handlePreview" />
```

```ts
const handlePreview = (payload) => {
  console.log(payload.w, payload.h)
  console.log(payload.img.transform)
}
```

返回值结构：

```ts
{
  w: number,
  h: number,
  url: string,
  img: {
    width: string,
    height: string,
    transform: string
  },
  html: string
}
```

<h2 id="section-4"><code>change</code></h2>

`change` 在图片首次可用，以及图片位置、缩放、旋转、翻转、截图框位置或大小发生变化后触发。同一动画帧内的连续变化会合并为一次最新状态。

```html
<vue-cropper :img="img" @change="handleChange" />
```

```ts
const handleChange = (state) => {
  console.log(state.image.scale, state.crop.x)
}
```

返回值结构：

```ts
{
  image: {
    x: number,
    y: number,
    scale: number,
    rotate: number,
    flipX: boolean,
    flipY: boolean
  },
  crop: { x: number, y: number, width: number, height: number }
}
```

调用 `getCropData()` 或 `getCropBlob()` 导出图片不会触发 `change`。

<h2 id="section-5">推荐用法（实时联动预览）</h2>

当前版本更推荐使用 `payload.url` + `payload.img` 来做轻量的实时预览渲染（纯 CSS），不需要在实时交互过程中频繁调用 `getCropData()`：

```html
<vue-cropper :img="img" @real-time="handlePreview" />

<section class="realtime-preview" :style="{ width: w + 'px', height: h + 'px', overflow: 'hidden' }">
  <img v-if="url" :src="url" :style="imgStyle" alt="realtime preview" />
</section>
```

```ts
const w = ref(0)
const h = ref(0)
const url = ref('')
const imgStyle = ref({ width: '0px', height: '0px', transform: '' })

const handlePreview = (payload) => {
  w.value = payload.w
  h.value = payload.h
  url.value = payload.url
  imgStyle.value = payload.img
}
```

<h2 id="section-6">关于 <code>html</code> 字段</h2>

- `html` 主要用于兼容/快速调试（历史上有人直接 `v-html` 渲染）。
- 不建议业务代码依赖 `html` 的结构，它可能在后续版本调整。
- 如果你确实要用 `v-html`，请注意注入风险，确保只渲染可信内容。

<h2 id="section-7">说明</h2>

- 当前版本支持 `real-time` 和 `realTime` 两种事件名，推荐优先使用 `real-time`。
- `imgMoving`、`cropMoving` 这类旧事件当前仍未开放。
- `imgLoad` 驼峰旧命名仍不作为正式事件，使用 `img-load`。

<h2 id="slots">插槽：加载状态与拖拽提示</h2>

使用 `#loading` 替换图片加载中的内容，使用 `#drag` 替换拖入文件时的提示。插槽只负责展示；上传后的图片仍通过 `img-upload` 回传，并由调用方更新 `img`。

```html
<vue-cropper :img="img" @img-upload="img = $event">
  <template #loading>图片加载中…</template>
  <template #drag>松开以使用这张图片</template>
</vue-cropper>
```

[查看完整加载示例](#/demo-loading) · [查看拖拽上传示例](#/demo-drag)

</LangBlock>

<LangBlock lang="en">

# Events

The current version emits the following public events.

Name | Description | Payload
--- | --- | ---
`img-load` | Fired when image loading succeeds or fails | `{ type: 'success' \| 'error', message: string }`
`img-upload` | Fired after drag upload or local file read succeeds | `string`
`real-time` | Fired when the image or crop box changes and preview data is updated | preview object
`realTime` | Compatibility alias of `real-time` | preview object
`change` | Fired when image or crop-box state changes | complete cropper state object

<h2 id="section-1"><code>img-load</code></h2>

```html
<vue-cropper :img="img" @img-load="handleImgLoad" />
```

```ts
const handleImgLoad = (payload) => {
  console.log(payload.type, payload.message)
}
```

On success:

```ts
{
  type: 'success',
  message: 'Image loaded successfully'
}
```

On failure:

```ts
{
  type: 'error',
  message: 'Image failed to load...'
}
```

<h2 id="section-2"><code>img-upload</code></h2>

```html
<vue-cropper :img="img" @img-upload="handleUpload" />
```

```ts
const handleUpload = (url) => {
  img.value = url
}
```

<h2 id="section-3"><code>real-time</code></h2>

```html
<vue-cropper :img="img" @real-time="handlePreview" />
```

```ts
const handlePreview = (payload) => {
  console.log(payload.w, payload.h)
  console.log(payload.img.transform)
}
```

Payload shape:

```ts
{
  w: number,
  h: number,
  url: string,
  img: {
    width: string,
    height: string,
    transform: string
  },
  html: string
}
```

<h2 id="section-4"><code>change</code></h2>

`change` fires when the image first becomes available and after the image position, scale, rotation, flip state, crop-box position, or crop-box size changes. Consecutive updates in the same animation frame are coalesced into the latest state.

```html
<vue-cropper :img="img" @change="handleChange" />
```

```ts
const handleChange = (state) => {
  console.log(state.image.scale, state.crop.x)
}
```

Payload shape:

```ts
{
  image: {
    x: number,
    y: number,
    scale: number,
    rotate: number,
    flipX: boolean,
    flipY: boolean
  },
  crop: { x: number, y: number, width: number, height: number }
}
```

Calling `getCropData()` or `getCropBlob()` does not emit `change`.

<h2 id="section-5">Recommended usage (live preview)</h2>

For realtime UI integration, prefer rendering a lightweight preview using `payload.url` + `payload.img` (CSS only). This avoids calling `getCropData()` frequently during interactions:

```html
<vue-cropper :img="img" @real-time="handlePreview" />

<section class="realtime-preview" :style="{ width: w + 'px', height: h + 'px', overflow: 'hidden' }">
  <img v-if="url" :src="url" :style="imgStyle" alt="realtime preview" />
</section>
```

```ts
const w = ref(0)
const h = ref(0)
const url = ref('')
const imgStyle = ref({ width: '0px', height: '0px', transform: '' })

const handlePreview = (payload) => {
  w.value = payload.w
  h.value = payload.h
  url.value = payload.url
  imgStyle.value = payload.img
}
```

<h2 id="section-6">About the <code>html</code> field</h2>

- `html` is mostly kept for compatibility / quick debugging (some integrations used to render it via `v-html`).
- Avoid depending on the `html` structure in production code; it may change in future versions.
- If you must use `v-html`, be aware of injection risks and only render trusted content.

<h2 id="section-7">Notes</h2>

- Both `real-time` and `realTime` are supported. Prefer `real-time` in new code.
- Old events such as `imgMoving` and `cropMoving` are still not exposed.
- The old camel-case `imgLoad` is not a supported public event. Use `img-load`.

<h2 id="slots">Slots: loading and drag hints</h2>

Use `#loading` to replace loading content and `#drag` to replace the file-drag hint. Slots only customize presentation. `img-upload` returns the loaded image, and the caller updates `img`.

```html
<vue-cropper :img="img" @img-upload="img = $event">
  <template #loading>Loading image…</template>
  <template #drag>Drop to use this image</template>
</vue-cropper>
```

[Complete loading example](#/demo-loading) · [Drag upload example](#/demo-drag)

</LangBlock>
