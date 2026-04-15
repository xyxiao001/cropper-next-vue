---
name: "release-workflow"
description: "发版前检查与发布流程清单（含命令模板）。当用户说“发版/更新版本/更新 changelog/发布到 npm”时调用。"
---

# Release Workflow

这个 skill 用于整理并执行一次“发版流程”，覆盖：

- 更新版本号（patch/minor/major 或指定版本）
- 更新 `src/pages/Changelog.md`
- 同步 README/文档与 Demo 示例
- 跑必要的测试/检查
- 给出最终发布命令（仅在用户明确授权时执行）

## 何时调用

在这些场景调用：

- 用户说“准备发版/发 patch/minor/major”
- 用户说“更新 version / 更新 changelog / 补齐文档”
- 用户说“发布到 npm / 跑 release 脚本”

## 默认约束

- 除非用户明确要求，不启动 dev server（如 `pnpm run dev`）。
- 除非用户明确要求，不跑构建类命令（如 `pnpm run build` / `pnpm run build:docs`）。
- 仅在用户明确授权时，才执行发布命令（如 `pnpm run release:npm -- patch`）。

## 标准流程（建议顺序）

1. 确认版本策略
   - `patch`: bugfix/小改动
   - `minor`: 新功能但兼容
   - `major`: 破坏性变更
   - 或用户给定明确版本号（例如 `0.1.3`）

2. 更新版本号（不打 tag）

```bash
pnpm version <patch|minor|major|x.y.z> --no-git-tag-version
```

3. 更新 Changelog
   - 文件：`src/pages/Changelog.md`
   - 需要中英文各一份
   - 内容建议聚焦“对外可见变更”：API/行为/兼容性/迁移点

4. 更新 README / 文档 / Demo
   - README：增加/更新实例方法、行为说明、破坏性变更提示
   - 文档页：
     - `src/pages/Props.md`（新增 props 行为、百分比含义等）
     - `src/pages/Methods.md`（新增实例方法列表与说明）
   - Demo 页：
     - `src/pages/DemoAll.md`：补充新 API 的交互示例
     - `src/pages/DemoLoading.md`：如涉及 loading 逻辑，统一用 `reload()`

5. 运行验证（最小集）

```bash
pnpm vitest run
```

如果需要更严格的检查（可能包含构建），先询问用户是否允许再执行：

```bash
pnpm run check
```

6. 发布前确认清单
   - 版本号已更新（`package.json`)
   - Changelog 已新增对应版本条目
   - README/文档已同步（中英文一致）
   - 关键测试通过
   - 变更点总结已准备（可直接粘贴到 release notes）

7. 发布命令（仅在用户明确授权时执行）

```bash
pnpm run release:npm -- <patch|minor|major|x.y.z>
```

## Release Notes 模板

```markdown
## <version>

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Notes
- ...
```

## 本仓库最近常见变更点（示例）

- 新增实例方法：`reload` / `setRotateAngle` / `setCropLayout` / `setCropAxis`
- `cropLayout` 百分比按 `wrapper` 尺寸换算
- `cropLayout >= wrapper` 进入“全屏截图模式”时展示淡边框/蒙层提示
