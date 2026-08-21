# 任务：裁剪状态与交互控制

**输入**：`spec.md`、`plan.md`、`research.md`、`data-model.md`、`contracts/`

**组织方式**：按三个 P0 用户故事拆分，每个故事都可独立测试。

## 阶段 1：准备

- [x] T001 运行现有测试并记录功能基线，命令定义在 `package.json`

## 阶段 2：公共基础

- [x] T002 在 `lib/interface.ts` 定义 `CropperState` 和 `change` 事件数据类型
- [x] T003 [P] 在 `tests/useCropState.test.ts` 编写状态快照和动画帧合并派发测试
- [x] T004 在 `lib/composables/useCropState.ts` 实现结构化状态快照和合并派发

**检查点**：状态模型可独立生成和测试，三个用户故事可以继续实施。

## 阶段 3：用户故事 1——一键恢复初始状态

**目标**：提供不重新加载图片的 `reset()`。

**独立测试**：改变图片与裁剪框后调用 `reset()`，状态恢复且图片加载次数不增加。

- [x] T005 [P] [US1] 在 `tests/vue-cropper.test.ts` 添加 `reset()` 公开合同与不重新加载图片的测试
- [x] T006 [P] [US1] 在 `tests/useInteractions.test.ts` 添加取消旧回弹后状态不再被覆盖的测试
- [x] T007 [US1] 在 `lib/composables/useInteractions.ts` 实现待回弹计时和旧动画失效入口
- [x] T008 [US1] 在 `lib/composables/useImagePipeline.ts` 提取可复用的当前图片初始布局计算
- [x] T009 [US1] 在 `lib/composables/usePublicMethods.ts` 实现 `reset()` 并恢复 prop 对应裁剪框
- [x] T010 [US1] 在 `lib/vue-cropper.vue` 装配并公开 `reset()`

**检查点**：用户故事 1 可独立通过组件测试。

## 阶段 4：用户故事 2——订阅完整裁剪状态

**目标**：新增不依赖实时预览的 `change` 结构化事件。

**独立测试**：加载、移动、缩放、旋转、裁剪框变化和重置均返回完整快照，导出不触发。

- [x] T011 [P] [US2] 在 `tests/vue-cropper.test.ts` 添加 `change` 首次派发、状态更新、重置和导出隔离测试
- [x] T012 [US2] 在 `lib/composables/useCropperEmits.ts` 添加 `change` 事件发送入口
- [x] T013 [US2] 在 `lib/vue-cropper.vue` 合并现有状态更新队列与 `change` 队列，并声明公开事件

**检查点**：用户故事 2 可在不监听 `real-time` 的情况下独立验证。

## 阶段 5：用户故事 3——关闭用户移动或缩放

**目标**：新增默认兼容且运行时生效的 `movable`、`zoomable`。

**独立测试**：关闭开关后对应鼠标和触摸输入不改变状态，实例方法仍有效。

- [x] T014 [P] [US3] 在 `tests/useInteractions.test.ts` 添加移动和双指缩放开关测试
- [x] T015 [P] [US3] 在 `tests/useWheelZoom.test.ts` 添加滚轮缩放开关测试
- [x] T016 [US3] 在 `lib/vue-cropper.vue` 声明默认值为 `true` 的 `movable`、`zoomable` props
- [x] T017 [US3] 在 `lib/composables/useInteractions.ts` 对图片拖拽、裁剪框拖拽和双指缩放应用开关
- [x] T018 [US3] 在 `lib/composables/useWheelZoom.ts` 对鼠标滚轮应用 `zoomable`

**检查点**：三个用户故事均可独立工作，未传 props 时保持原有行为。

## 阶段 6：文档、示例与验证

- [x] T019 [P] 在 `src/pages/Props.md`、`src/pages/Methods.md`、`src/pages/Event.md` 更新中英文 API 文档
- [x] T020 [P] 在 `src/pages/Home.vue` 添加重置按钮、移动开关和缩放开关示例
- [x] T021 按 `specs/001-cropper-state-controls/quickstart.md` 验证首页交互
- [x] T022 运行 `pnpm run check`、`pnpm run build:docs` 和 `git diff --check`

## 阶段 7：补充全功能演示

- [x] T023 在 `src/pages/DemoAll.md` 添加重置按钮、移动与缩放开关及 `change` 状态展示
- [x] T024 运行类型检查、文档构建、全功能页面浏览器验收和 `git diff --check`

## 依赖与执行顺序

- T001 → T002 → T003/T004，完成公共状态基础。
- 用户故事 1、2、3 均依赖公共基础；涉及同一文件时按 US1 → US2 → US3 顺序合并。
- T005/T006 可并行，T014/T015 可并行，T019/T020 可并行。
- T021/T022 依赖所有实现和文档任务完成。

## 增量策略

1. 先完成公共状态基础。
2. 完成并验证 `reset()`。
3. 接入 `change` 事件。
4. 接入两个交互开关。
5. 补文档、首页示例并执行完整验证。

## 格式校验

- 共 24 个任务，编号连续。
- 用户故事任务均带 `[US1]`、`[US2]` 或 `[US3]`。
- 可并行任务均标记 `[P]`。
- 每个任务都包含明确文件路径或命令来源文件。
