<LangBlock lang="zh">

# 事件

当前版本实际对外触发的事件如下。

名称 | 说明 | 返回值
--- | --- | ---
`img-load` | 图片加载完成或失败时触发 | `{ type: 'success' | 'error', message: string }`
`img-upload` | 拖拽上传或本地文件读取成功时触发 | `string`
`real-time` | 图片或截图框变化时触发预览数据 | 预览对象
`realTime` | `real-time` 的兼容别名 | 预览对象

## `img-load`

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

## `img-upload`

```html
<vue-cropper :img="img" @img-upload="handleUpload" />
```

```ts
const handleUpload = (url) => {
  img.value = url
}
```

## `real-time`

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

## 说明

- 当前版本支持 `real-time` 和 `realTime` 两种事件名，推荐优先使用 `real-time`。
- `imgMoving`、`cropMoving` 这类旧事件当前仍未开放。
- `imgLoad` 驼峰旧命名仍不作为正式事件，使用 `img-load`。

</LangBlock>

<LangBlock lang="en">

# Events

The current version emits the following public events.

Name | Description | Payload
--- | --- | ---
`img-load` | Fired when image loading succeeds or fails | `{ type: 'success' | 'error', message: string }`
`img-upload` | Fired after drag upload or local file read succeeds | `string`
`real-time` | Fired when the image or crop box changes and preview data is updated | preview object
`realTime` | Compatibility alias of `real-time` | preview object

## `img-load`

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

## `img-upload`

```html
<vue-cropper :img="img" @img-upload="handleUpload" />
```

```ts
const handleUpload = (url) => {
  img.value = url
}
```

## `real-time`

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

## Notes

- Both `real-time` and `realTime` are supported. Prefer `real-time` in new code.
- Old events such as `imgMoving` and `cropMoving` are still not exposed.
- The old camel-case `imgLoad` is not a supported public event. Use `img-load`.

</LangBlock>
