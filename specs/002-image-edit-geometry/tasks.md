# 任务：图片编辑与原图几何

**输入**：`spec.md`、`plan.md`、`research.md`、`data-model.md`、`contracts/`、`quickstart.md`

**组织方式**：按三个 P1 用户故事拆分；测试任务先于对应实现任务。

## 阶段 1：准备

- [x] T001 运行 `pnpm run test:run` 并记录当前缩放、旋转、预览和导出基线

## 阶段 2：公共基础

- [x] T002 在 `lib/interface.ts` 和 `lib/composables/state.ts` 添加 `flipX`、`flipY` 与原图裁剪几何类型
- [x] T003 在 `lib/common.ts` 统一包含屏幕轴翻转的 CSS 变换表达，保持未翻转输出不变

**检查点**：图片状态和变换表达可供三个用户故事复用。

## 阶段 3：用户故事 1——限制图片缩放范围（优先级：P1）

**目标**：所有用户和公开缩放入口遵守最新有效范围，并保持边界覆盖优先。

**独立测试**：通过各缩放入口越过上下限，验证比例与位置停止；制造边界冲突，验证覆盖所需比例优先。

- [x] T004 [P] [US1] 在 `tests/useScaleLimits.test.ts` 添加配置范围、边界有效范围和越界固定测试
- [x] T005 [P] [US1] 在 `tests/useInteractions.test.ts` 添加滚轮/双指共享范围、锚点越界不位移和边界冲突测试
- [x] T006 [P] [US1] 在 `tests/vue-cropper.test.ts` 添加 props 默认兼容、公开方法限制、初始布局、reset 和运行时更新测试
- [x] T007 [US1] 在 `lib/composables/useScaleLimits.ts` 实现配置范围、边界有效范围和比例限制
- [x] T008 [US1] 在 `lib/composables/useInteractions.ts` 对触摸与滚轮目标比例应用有效范围，并在越界无变化时保持位置
- [x] T009 [US1] 在 `lib/composables/useImagePipeline.ts` 和 `lib/composables/usePublicMethods.ts` 对初始布局、reset 及公开缩放应用范围
- [x] T010 [US1] 在 `lib/vue-cropper.vue` 声明默认兼容的 `minScale`、`maxScale` 并装配缩放范围

**检查点**：用户故事 1 可独立通过缩放与组件合同测试。

## 阶段 4：用户故事 2——水平或垂直翻转图片（优先级：P1）

**目标**：翻转相对屏幕方向执行，主视图、预览、状态和导出一致。

**独立测试**：组合旋转与两种翻转，验证两次同向翻转恢复、导出矩阵一致且 reset 清除状态。

- [x] T011 [P] [US2] 在 `tests/common.test.ts` 添加未翻转兼容、屏幕轴 CSS 变换和 Canvas 导出翻转测试
- [x] T012 [P] [US2] 在 `tests/vue-cropper.test.ts` 添加翻转方法、change 字段、双次恢复、旋转组合和 reset 测试
- [x] T013 [US2] 在 `lib/common.ts` 为内存 Canvas 和 URL 兼容导出路径应用屏幕轴水平/垂直翻转
- [x] T014 [US2] 在 `lib/composables/useInteractions.ts` 和 `lib/composables/useImagePipeline.ts` 的样式更新中保留翻转状态
- [x] T015 [US2] 在 `lib/composables/useCropRender.ts` 和 `lib/composables/useRealTime.ts` 同步翻转预览变换
- [x] T016 [US2] 在 `lib/composables/useExport.ts`、`lib/composables/useCropState.ts` 传递翻转导出状态和 change 字段
- [x] T017 [US2] 在 `lib/composables/usePublicMethods.ts` 实现 `flipHorizontal()`、`flipVertical()` 并让 `reset()` 清除翻转
- [x] T018 [US2] 在 `lib/vue-cropper.vue` 装配并公开两个翻转方法

**检查点**：用户故事 2 的视图、状态和导出合同一致。

## 阶段 5：用户故事 3——获取原图裁剪坐标（优先级：P1）

**目标**：同步返回方向校正后源图的四角点、外接矩形、尺寸和变换信息。

**独立测试**：对移动、缩放、任意角度旋转和翻转组合做正反变换，误差不超过 `0.01` 像素且读取不派发事件。

- [x] T019 [P] [US3] 在 `tests/useCropCoordinates.test.ts` 添加无变换、任意角度、双向翻转、越界点和外接矩形测试
- [x] T020 [P] [US3] 在 `tests/vue-cropper.test.ts` 添加 `getCropCoordinates()` 公开合同、空图片和事件隔离测试
- [x] T021 [US3] 在 `lib/composables/useCropCoordinates.ts` 实现裁剪框四角到源图的逆变换和外接矩形计算
- [x] T022 [US3] 在 `lib/vue-cropper.vue` 装配并公开同步 `getCropCoordinates()`

**检查点**：用户故事 3 可独立生成服务端可消费的精确几何。

## 阶段 6：文档、示例与验证

- [x] T023 [P] 在 `src/pages/Props.md`、`src/pages/Methods.md`、`src/pages/Event.md` 更新中英文公开 API 文档
- [x] T024 [P] 在 `src/pages/DemoAll.md` 添加缩放范围、水平/垂直翻转和原图坐标展示
- [x] T025 按 `specs/002-image-edit-geometry/quickstart.md` 验证全功能页面
- [x] T026 运行 `pnpm run check`、`pnpm run build:docs` 和 `git diff --check`

## 依赖与执行顺序

- T001 → T002/T003，完成公共状态和变换表达。
- US1、US2、US3 均依赖公共基础；为减少同文件冲突，按 US1 → US2 → US3 顺序整合。
- 每个故事内部先写测试并确认失败，再完成实现。
- T023/T024 可并行，T025/T026 依赖全部实现和文档任务。

## 并行机会

- T004、T005、T006 可并行编写。
- T011、T012 可并行编写。
- T019、T020 可并行编写。
- T023、T024 修改不同文档，可并行执行。

## 增量策略

1. 先完成公共状态与变换表达。
2. 交付缩放范围作为第一个独立增量。
3. 交付翻转并验证视图、状态和导出。
4. 交付纯读取的原图几何。
5. 补文档、全功能示例并执行完整门禁。

## 格式校验

- 共 26 个任务，编号连续。
- 用户故事任务均带 `[US1]`、`[US2]` 或 `[US3]`。
- 可并行任务均标记 `[P]`。
- 每个任务都包含明确文件路径或命令来源文件。
