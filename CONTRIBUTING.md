# Contributing

感谢你为 `cropper-next-vue` 做改动。

## 开发要求

- Node.js `>=22`
- pnpm `9.15.9`

## 本地流程

```bash
corepack enable
pnpm install
pnpm run dev
```

常用检查命令：

```bash
pnpm run typecheck
pnpm run test:coverage
pnpm run build:lib
pnpm run build:docs
pnpm run check
```

## 提交要求

- 保持库构建和文档构建都可用
- 新增行为优先补测试
- 不提交无关构建产物或临时调试代码
- 发布前至少执行一次 `pnpm run check`

## 提交 Issue

- Bug 请提供最小复现、浏览器信息以及 Vue 和 `cropper-next-vue` 版本
- 功能建议请说明使用场景、预期行为和替代方案

## 变更范围

欢迎这些方向的改进：

- 裁剪几何和边界控制
- Vue 3 兼容性和类型质量
- 文档、示例和测试覆盖率
- 发布链和工程质量
