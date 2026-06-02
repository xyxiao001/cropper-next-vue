<LangBlock lang="zh">

# Changelog

这个页面用来记录每个版本的改动，方便回溯功能与 API 变化。

## 0.3.0

- 新增实例缩放方法：`zoomIn`、`zoomOut`、`changeScale`
- 首页补充缩放按钮示例，文档补齐缩放方法说明
- 修复连续滚轮缩放后加速状态未复位导致缩放幅度异常的问题
- 优化大图按钮缩放体验，`zoomIn` / `zoomOut` 改为按当前缩放比例相对调整

## 0.2.0

- 重构核心实现，拆分 composables，便于维护与扩展（对外 API 基本保持不变）
- 预览链路优化：基于 `wrapper + dpr` 生成预览并支持 `previewMaxSide` 限制，提升大图性能与稳定性
- 更新文档与示例页（Props / Event / Demo 等）
- 补充并修复测试用例（新增 preview 单测，组件用例适配 jsdom）

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

## 0.3.0

- Added public zoom instance methods: `zoomIn`, `zoomOut`, and `changeScale`
- Added zoom button examples on the home page and updated method docs
- Fixed abnormal zoom jumps after continuous mouse-wheel zooming by resetting wheel acceleration state
- Improved large-image button zooming by making `zoomIn` / `zoomOut` relative to the current scale

## 0.2.0

- Refactored the core implementation by splitting logic into composables (public API stays mostly the same)
- Improved preview pipeline: generates preview with `wrapper + dpr` and adds a `previewMaxSide` cap for large images
- Updated docs and demo pages (Props / Event / Demos)
- Improved tests (added preview unit tests and stabilized component tests in jsdom)

## 0.1.3

- Added instance methods: `reload`, `setRotateAngle`, `setCropLayout`, `setCropAxis`
- Percentage-based `cropLayout` values now respect the current `wrapper` size (e.g. `'60%'`)
- Added a subtle frame/mask hint when entering the "full-frame crop mode" (`cropLayout >= wrapper`)

## 0.1.2

- Added export prop: `original` (scale up export pixels by the current zoom)
- Added export prop: `maxSideLength` (clamp export max edge size, default `3000`, `0` disables)

</LangBlock>
