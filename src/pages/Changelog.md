<LangBlock lang="zh">

# Changelog

这个页面用来记录每个版本的改动，方便回溯功能与 API 变化。

## 0.1.3

- 新增实例方法：`reload`、`setRotateAngle`、`setCropLayout`、`setCropAxis`
- `cropLayout` 支持基于 `wrapper` 的百分比换算（如 `'60%'`）
- 当 `cropLayout >= wrapper` 进入“全屏截图模式”时，新增淡边框/蒙层视觉提示

## 0.1.2

- 新增导出参数：`original`（按当前缩放倍数放大导出像素）
- 新增导出参数：`maxSideLength`（限制导出最长边像素，默认 `3000`，传 `0` 关闭）

</LangBlock>

<LangBlock lang="en">

# Changelog

This page tracks version changes and API updates.

## 0.1.3

- Added instance methods: `reload`, `setRotateAngle`, `setCropLayout`, `setCropAxis`
- Percentage-based `cropLayout` values now respect the current `wrapper` size (e.g. `'60%'`)
- Added a subtle frame/mask hint when entering the "full-frame crop mode" (`cropLayout >= wrapper`)

## 0.1.2

- Added export prop: `original` (scale up export pixels by the current zoom)
- Added export prop: `maxSideLength` (clamp export max edge size, default `3000`, `0` disables)

</LangBlock>
