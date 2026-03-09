<LangBlock lang="zh">

# 方法

当前版本通过组件 `ref` 暴露的方法较少，主要用于获取裁剪结果。

## 获取实例

```ts
const cropper = ref()
```

```html
<vue-cropper ref="cropper" :img="img" />
```

## 方法列表

方法 | 说明
--- | ---
`cropper.value.getCropData(type?)` | 获取裁剪结果，返回 `Promise<string>`
`cropper.value.getCropBlob()` | 获取裁剪结果，返回 `Promise<Blob>`
`cropper.value.rotateLeft()` | 向左旋转 `90deg`
`cropper.value.rotateRight()` | 向右旋转 `90deg`
`cropper.value.rotateClear()` | 清空旋转角度，恢复为 `0deg`

## 参数说明

`getCropData(type?)`

- 默认返回 base64 数据
- 当前实现会根据组件的 `outputType` 输出对应格式
- `type` 参数当前主要用于兼容调用方式，推荐直接使用默认值

`getCropBlob()`

- 返回 `Blob`
- 更适合直接上传到服务端或和 `FormData` 搭配使用

## 示例

```ts
cropper.value.getCropData().then((data) => {
  console.log(data)
})
```

```ts
cropper.value.getCropBlob().then((blob) => {
  const formData = new FormData()
  formData.append('file', blob, 'crop.png')
})
```

## 说明

当前版本仍然没有旧版的 `startCrop`、`stopCrop`、`clearCrop`、`changeScale`、`getImgAxis`、`getCropAxis`、`goAutoCrop`。这些属于旧版“可变裁剪框”路线，和当前实现不一致。

</LangBlock>

<LangBlock lang="en">

# Methods

The current version exposes a small set of instance methods through component `ref`, mainly focused on export and rotation control.

## Get the instance

```ts
const cropper = ref()
```

```html
<vue-cropper ref="cropper" :img="img" />
```

## Method list

Method | Description
--- | ---
`cropper.value.getCropData(type?)` | Get crop result as `Promise<string>`
`cropper.value.getCropBlob()` | Get crop result as `Promise<Blob>`
`cropper.value.rotateLeft()` | Rotate left by `90deg`
`cropper.value.rotateRight()` | Rotate right by `90deg`
`cropper.value.rotateClear()` | Reset rotation back to `0deg`

## Details

`getCropData(type?)`

- returns base64 by default
- uses the component `outputType` as the export format
- the `type` parameter is kept mainly for compatibility, and the default is recommended

`getCropBlob()`

- returns a `Blob`
- better suited for uploads and `FormData`

## Example

```ts
cropper.value.getCropData().then((data) => {
  console.log(data)
})
```

```ts
cropper.value.getCropBlob().then((blob) => {
  const formData = new FormData()
  formData.append('file', blob, 'crop.png')
})
```

## Notes

The current version still does not include old APIs such as `startCrop`, `stopCrop`, `clearCrop`, `changeScale`, `getImgAxis`, `getCropAxis`, or `goAutoCrop`. Those belonged to the old resizable crop-box direction.

</LangBlock>
