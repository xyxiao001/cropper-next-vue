# 文档重构验证指南

## 环境与预览

Node.js >=22、pnpm 9.15.9，先执行 `pnpm install --frozen-lockfile`。

开发服务：`pnpm run dev --host 127.0.0.1 --port 5174 --strictPort`。若当前服务已启动，直接复用，不重复启动。

设计稿：`http://127.0.0.1:5174/specs/005-docs-experience-redesign/design-preview.html`。可切换首页、文档与工作台，仅用于设计确认。

正式站点：`http://127.0.0.1:5174/`。在实现完成前仍是旧站点。

## 实现后的自动检查

```bash
pnpm run typecheck
pnpm exec vitest run tests/docs-navigation.test.ts tests/docs-interactions.test.ts tests/docs-examples.test.ts
pnpm run build:docs
git diff --check
```

相关测试文件将在实现阶段创建。默认不运行 lint。不提交构建产物。

## 浏览器验证

1. 首页到快速开始：明确用途、两个入口，按完整示例独立完成首次裁剪导出。
2. 访问契约文件列出的 20 个旧路由和新概念页，逐页核对标题、内容与导航。
3. 同页章节、跨页章节、直接章节 URL、语言切换后章节定位均正确。
4. 边界、比例、导出三项主题的操作与讲解对应；实际导出像素和格式来自结果。
5. 三个场景选择/调整/导出结果可用，圆形头像仅作显示、上传扩展需业务服务均说明清楚。
6. 工作台原有编辑、导出、方法和数据功能均保留。
7. 在 375/768/1440px 检查每页正文、表格、代码和控件，无整页横向溢出。
8. 中文与英文完成导航、阅读、代码展开/复制；键盘能访问站点公共操作并看见焦点。

## 独立接入代码

将快速开始和三个场景的完整 SFC 放入一个已有可运行的 Vue 3 项目，使用公开包导入，按说明提供图片，得到本地导出结果。验证不依赖 `src/components`、`src/composables` 或其他文档私有模块。

## 人工验收

按 spec SC-001/SC-002 安排真实首次使用者测试，记录人数与耗时；没有真实读者参与时标为待验收。
