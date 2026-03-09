# Contributing

感谢你为 `cropper-next-vue` 做改动。

## 开发要求

- Node.js `>=18`
- npm `>=9`

## 本地流程

```bash
npm install
npm run dev
```

常用检查命令：

```bash
npm run typecheck
npm run test:coverage
npm run build:lib
npm run build:docs
npm run check
```

## 提交要求

- 保持库构建和文档构建都可用
- 新增行为优先补测试
- 不提交无关构建产物或临时调试代码
- 发布前至少执行一次 `npm run check`

## 变更范围

欢迎这些方向的改进：

- 裁剪几何和边界控制
- Vue 3 兼容性和类型质量
- 文档、示例和测试覆盖率
- 发布链和工程质量
