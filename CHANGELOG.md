# Changelog

本文件记录 `cropper-next-vue` 的主要用户可见变更。

## [0.4.0] - 2026-08-21

### Added

- 结构化 `change` 状态事件和无重新加载的 `reset()`
- 图片移动、交互缩放开关及缩放上下限
- 水平/垂直翻转和原图裁剪坐标
- 支持四边与四角操作的可缩放裁剪框
- 固定比例及最小/最大裁剪尺寸限制

### Fixed

- 保持导出图片宽高比
- 修正缩放回弹时的图片中心位置

## [0.2.0] - 2026-04-15

### Added

- 图片导出参数 `original` 和 `maxSideLength`
- 旋转、缩放、重载和布局控制实例方法
- 全屏裁剪模式提示

### Changed

- 文档站首页、导航和响应式布局升级

## [0.1.0] - 2026-03-10

### Added

- 首个公开版本
- Vue 3 图片裁剪组件、文档站和 npm 库构建
- 图片旋转、边界控制、实时预览与基础导出

[0.4.0]: https://github.com/xyxiao001/cropper-next-vue/releases/tag/v0.4.0
[0.2.0]: https://github.com/xyxiao001/cropper-next-vue/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/xyxiao001/cropper-next-vue/releases/tag/v0.1.0
