# cropper-next-vue Agent Guide

## 适用范围

本文件适用于整个仓库。开始任务前先阅读本文件；使用 spec-kit 时同时遵循 `.specify/memory/constitution.md`。更深层目录若新增 `AGENTS.md`，其规则只覆盖对应子目录。

## 项目定位

`cropper-next-vue` 是一个 Vue 3 图片裁剪库，同时包含 npm 库源码和文档示例站：

- `lib/`：发布到 npm 的组件、组合式函数、触摸交互、裁剪几何和导出逻辑。
- `src/`：文档站、首页和示例页面，不作为库运行时代码发布。
- `tests/`：Vitest 单元测试与运行时测试。
- `scripts/`：发布脚本。
- `dist/`、`docs-dist/`：构建产物，不作为功能修改源文件。

## 技术栈与命令

- Node.js：`>=22`
- 包管理器：`pnpm@9.15.9`
- 核心技术：Vue 3、TypeScript、Vite、Vitest

常用命令：

```bash
pnpm install
pnpm run dev
pnpm run typecheck
pnpm run test:run
pnpm run test:coverage
pnpm run build:lib
pnpm run build:docs
pnpm run check
```

## 需求范围纪律

- 只实现用户明确要求的行为，不以健壮性、兼容性或体验优化为由扩大范围。
- 未经明确授权，不新增默认值替代、字段兼容、异常吞掉、自动重试、降级分支、额外校验或错误提示。
- 修改 prop、常量、文案或条件时，保持未被点名的数据来源、事件时机、控制流程、提交参数和异常处理不变。
- 不做与当前需求无关的重构、格式化或顺手修复。
- 如完成需求确实需要扩大范围，先列出新增行为、涉及文件、必要性和用户影响，获得确认后再实施。

## Spec Kit 流程

新增公开 prop、事件、实例方法、裁剪几何行为、交互模式或跨模块功能时，使用 spec-kit。纯文案调整或边界清晰的小型修复可以直接实施；用户明确要求 spec-kit 时始终使用。

完整流程：

1. `$speckit-specify`：只描述要解决的问题、用户场景、范围和验收标准，不写实现方案。
2. `$speckit-clarify`：存在会影响范围或用户体验的歧义时执行。
3. 人工确认 `spec.md` 后再进入计划。
4. `$speckit-plan`：结合本仓库技术栈生成实现方案。
5. 人工确认 `plan.md` 后再拆任务。
6. `$speckit-tasks`：生成按依赖排序、包含明确文件路径的任务。
7. `$speckit-analyze`：检查 spec、plan、tasks 与 constitution 的一致性。
8. `$speckit-implement`：严格按已确认任务实施，不在实现阶段扩大需求。
9. `$speckit-converge`：检查实现与规格的差距，并把剩余工作写回任务清单。

每个功能的规格文件保存在 `specs/<NNN-feature-name>/`。`.specify/feature.json` 是本机当前功能指针，不提交到 Git。

## 实现约束

- `lib/vue-cropper.vue` 是公开 props 和组件能力的入口。
- `lib/composables/` 按职责承载交互、渲染、导出、图片管线和公开方法；保持现有职责边界。
- `imgAxis.x/y` 表示缩放后图片左上角坐标；修改缩放或旋转算法时必须明确坐标系并补回归测试。
- 鼠标、触摸、旋转和 `centerBox` / `centerWrapper` 边界行为可能互相影响，只修改规格点名的组合。
- 新增或修改公开 API 时，同步更新 `src/pages/` 中对应的中英文文档；需要演示时再修改示例页。
- 不手工编辑或提交 `dist/`、`docs-dist/`、覆盖率目录和临时调试文件。

## 验证要求

- 新增行为必须补最小且直接的回归测试。
- 库逻辑变更至少运行 `pnpm run check`。
- 文档站或示例页变更额外运行 `pnpm run build:docs`。
- 提交前执行 `git diff --check`，复核 diff 并移除超出需求的兜底、校验、重构和顺手优化。
- 不因测试困难而降低已有覆盖率阈值。

## Git 与交付

- 保留用户已有改动，不覆盖或清理无关文件。
- 未经用户明确要求，不修改版本号、不创建 tag、不推送远端、不发布 npm。
- 提交信息简洁描述用户可见结果，例如 `feat: support pointer-centered zoom`。
- 交付时说明改动范围、验证命令与结果，以及是否已经提交。
