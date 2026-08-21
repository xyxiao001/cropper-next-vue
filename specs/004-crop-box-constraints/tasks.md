# 任务：裁剪框比例与尺寸限制

**输入**：`specs/004-crop-box-constraints/` 下的规格、计划、调研、数据模型、公开契约和快速验证场景

**前置条件**：`spec.md` 与 `plan.md` 已确认

**测试要求**：遵循项目章程，先添加最小且直接的失败测试，再实现对应约束。

**组织方式**：任务按用户故事分组；每项任务包含明确文件路径和执行依赖。

## 格式：`[ID] [P?] [Story] 描述`

- **[P]**：可与同阶段其他任务并行，涉及不同文件且无未完成依赖
- **[Story]**：对应 `spec.md` 中的用户故事

## Phase 1：基础类型与会话模型

**目标**：建立比例、尺寸限制和会话快照的内部类型，不改变运行时行为。

- [x] T001 在 `lib/interface.ts` 增加裁剪框约束类型，并让缩放会话保存约束快照

**检查点**：纯几何函数和组件接线可以共享同一套约束类型。

---

## Phase 2：用户故事 1——按指定比例调整裁剪框（P1）🎯 MVP

**目标**：支持任意正数宽高比；角保持对角锚点，边保持对边并围绕另一维中心对称变化。

**独立测试**：设置 1:1、4:3、16:9 后操作四角和四边，结果保持比例、锚点正确且不越过容器；未设置比例时现有自由缩放不变。

### 测试

- [x] T002 [US1] 在 `tests/useCropResize.test.ts` 添加 1:1、4:3、16:9 的四角比例、对角锚点和容器边界失败测试
- [x] T003 [US1] 在 `tests/useCropResize.test.ts` 添加固定比例下四边对边固定、另一维中心对称和容器边界失败测试
- [x] T004 [US1] 在 `tests/vue-cropper.test.ts` 添加 `cropAspectRatio` 默认未设置、运行时更新从下一次拖动生效的失败契约测试

### 实现

- [x] T005 [US1] 在 `lib/composables/useCropResize.ts` 实现固定比例可行区间、角主轴选择和四边中心对称几何
- [x] T006 [US1] 在 `lib/vue-cropper.vue` 声明 `cropAspectRatio` prop，并在开始拖动时写入约束快照
- [x] T007 [US1] 运行 `tests/useCropResize.test.ts` 与 `tests/vue-cropper.test.ts`，确认比例行为和现有自由缩放回归通过

**检查点**：用户故事 1 可独立使用；不传比例时行为不变。

---

## Phase 3：用户故事 2——限制裁剪框大小（P2）

**目标**：为用户拖动增加最小宽高和最大宽高，并与比例及容器边界共同生效。

**独立测试**：配置最小和最大宽高后向内、向外拖动八个控制器，自由比例与固定比例结果都准确停留在全部约束的交集内。

### 测试

- [x] T008 [US2] 在 `tests/useCropResize.test.ts` 添加自由比例下八方向最小宽高、最大宽高和容器边界失败测试
- [x] T009 [US2] 在 `tests/useCropResize.test.ts` 添加固定比例与最小/最大宽高组合、四边中心空间限制的失败测试
- [x] T010 [US2] 在 `tests/vue-cropper.test.ts` 添加四个尺寸 prop 默认值、参数传递和会话快照失败契约测试
- [x] T011 [US2] 在 `tests/vue-cropper.test.ts` 添加初始 `cropLayout`、`setCropLayout()` 与 `reset()` 不受新增约束改写的兼容测试

### 实现

- [x] T012 [US2] 在 `lib/composables/useCropResize.ts` 将最小/最大宽高与比例、锚点容器空间统一为可行区间
- [x] T013 [US2] 在 `lib/vue-cropper.vue` 声明四个尺寸 prop，并把当前值加入每次拖动的约束快照
- [x] T014 [US2] 运行 `tests/useCropResize.test.ts` 与 `tests/vue-cropper.test.ts`，确认尺寸、组合约束和程序化入口兼容测试通过

**检查点**：用户故事 1 和 2 的首版拖动约束成立；程序化入口的约束由 Phase 6 的需求修订增量补充。

---

## Phase 4：用户故事 3——通过文档和示例验证限制能力（P3）

**目标**：全功能工作台可以直接操控比例和尺寸限制，主要中英文入口准确说明公开契约。

**独立测试**：无需改代码即可在全功能 Demo 切换自由、1:1、4:3、16:9 和最小/最大宽高，并从状态、原图坐标与导出结果验证实际裁剪框。

- [x] T015 [US3] 在 `src/pages/DemoAll.vue` 增加自由/1:1/4:3/16:9比例选择和最小宽高、最大宽高控制，并传入现有裁剪器
- [x] T016 [P] [US3] 在 `README.md` 更新中英文能力列表、公开参数和比例尺寸限制示例
- [x] T017 [P] [US3] 在 `src/pages/Guide.md` 更新中英文交互限制用法和程序化入口不受约束的说明
- [x] T018 [P] [US3] 在 `src/pages/Props.md` 更新中英文参数表、默认值、单位、适用范围、组合规则与调用方责任
- [x] T019 [US3] 运行 `pnpm run build:docs` 并在全功能 Demo 验证比例、尺寸控件和状态输出

**检查点**：文档名称和默认值与代码一致，全功能 Demo 覆盖全部必要操控，不新增独立页面。

---

## Phase 5：完整验证与范围复核

**目标**：确认实现满足规格、无超范围改动，全部项目检查通过。

- [x] T020 按 `specs/004-crop-box-constraints/quickstart.md` 执行关键鼠标交互场景并复核 `git diff`
- [x] T021 运行 `pnpm run check`、`pnpm run build:docs` 和 `git diff --check`
- [x] T022 对照 `specs/004-crop-box-constraints/spec.md`、`plan.md` 与 `tasks.md` 完成收敛检查并记录全部任务状态

---

## Phase 6：需求修订增量——限制总开关与程序化入口约束

**目标**：落实 2026-08-21 确认的修订范围：新增默认关闭的限制总开关；开启后统一约束拖动、初始及运行时 `cropLayout`、`setCropLayout()` 和 `reset()`；修复超限初始框首次拖动突变，并完成全功能 Demo 坐标输入优化。

**独立测试**：关闭限制开关时，传入比例和尺寸参数不改变既有拖动与程序化入口；开启开关后，所有入口均满足比例、最小/最大尺寸和容器边界，`300 × 200` 在 `1:1` 下得到 `200 × 200`，首次拖动不发生尺寸突变。

### 测试

- [x] T023 [US2] 在 `tests/useCropResize.test.ts` 添加自由比例与固定比例程序化尺寸归一化、最小/最大尺寸及容器边界失败测试
- [x] T024 [US2] 在 `tests/vue-cropper.test.ts` 添加 `cropBoxConstraintsEnabled` 默认关闭、关闭时兼容及开启时拖动约束失败测试
- [x] T025 [US2] 在 `tests/vue-cropper.test.ts` 添加开启限制后初始及运行时 `cropLayout`、`setCropLayout()`、`reset()` 和首次拖动无突变失败测试

### 实现

- [x] T026 [US2] 在 `lib/composables/useCropResize.ts` 提供拖动与程序化入口共享的纯尺寸约束函数
- [x] T027 [US2] 在 `lib/vue-cropper.vue` 增加默认关闭的 `cropBoxConstraintsEnabled` prop，并按开关选择拖动约束快照
- [x] T028 [US2] 在 `lib/composables/useCropLayout.ts`、`lib/composables/useCropRender.ts` 与 `lib/composables/useCropperWatchers.ts` 接入实际有效尺寸，使全部程序化入口统一受开关控制
- [x] T029 [US3] 在 `src/pages/DemoAll.vue` 增加裁剪框限制总开关，并完成无加减控制器、可用宽度的裁剪框坐标输入
- [x] T030 [P] [US3] 在 `README.md`、`src/pages/Guide.md`、`src/pages/Props.md` 与 `src/pages/Methods.md` 同步总开关、程序化入口和组合规则说明

### 验证

- [x] T031 运行 `pnpm run check`、`pnpm run build:docs`、`git diff --check`，并按 `specs/004-crop-box-constraints/quickstart.md` 验证全功能 Demo 与首次拖动场景
- [x] T032 对照 `specs/004-crop-box-constraints/spec.md`、`plan.md` 与修订任务完成收敛检查，确认无超范围行为

**检查点**：修订后的全部用户故事、公开契约、Demo 和文档一致，默认关闭保持兼容，开启后所有尺寸入口使用同一实际约束结果。

---

## Phase 7：需求修订增量——运行时开启限制后居中

**目标**：运行时把裁剪框限制从关闭切换为开启时，使用应用限制后的实际尺寸重新居中；其他约束更新与坐标入口保持原行为。

**独立测试**：在 `320 × 240` 容器中先显示覆盖容器的裁剪框，再开启最大 `200 × 160` 的限制，最终裁剪坐标应为 `x = 60`、`y = 40`；限制保持开启时继续修改最大尺寸，不再次强制居中。

- [x] T033 [US2] 在 `tests/vue-cropper.test.ts` 添加运行时开启限制后按实际尺寸居中、限制已开启后的参数更新不重新居中的失败测试
- [x] T034 [US2] 在 `lib/composables/useCropperWatchers.ts` 与 `lib/vue-cropper.vue` 仅对 `cropBoxConstraintsEnabled` 的 `false → true` 转换调用现有居中渲染流程
- [x] T035 [P] [US3] 在 `src/pages/Guide.md` 与 `src/pages/Props.md` 补充运行时开启限制后的居中规则
- [x] T036 运行 `pnpm run check`、`pnpm run build:docs`、`git diff --check`，并在 `src/pages/DemoAll.vue` 对应全功能 Demo 验证开启限制后居中
- [x] T037 对照 `specs/004-crop-box-constraints/spec.md`、`plan.md` 与 Phase 7 任务完成收敛检查

**检查点**：开关开启瞬间居中，限制已开启后的其他参数变化不改变现有位置语义。

---

## 依赖与执行顺序

### 阶段依赖

- **Phase 1**：无依赖，首先完成。
- **Phase 2 / US1**：依赖 T001；T002-T004 先失败，随后完成 T005-T007。
- **Phase 3 / US2**：依赖比例几何基础；T008-T011 先失败，随后完成 T012-T014。
- **Phase 4 / US3**：依赖全部公开 prop 稳定；T015-T018 完成后执行 T019。
- **Phase 5**：依赖三个用户故事完成，按 T020-T022 顺序收口。
- **Phase 6 修订增量**：以已完成的首版几何为基础；T023-T025 必须先失败，再依次完成 T026-T030，最后执行 T031-T032。
- **Phase 7 居中修订**：依赖 Phase 6；T033 先失败，完成 T034-T035 后执行 T036-T037。

### 用户故事依赖

- **US1**：提供固定比例缩放 MVP。
- **US2**：复用 US1 的统一可行区间，增加可配置最小/最大尺寸。
- **US3**：依赖 US1/US2 的最终公开参数，用于 Demo 和文档。
- **修订后的 US2/US3**：Phase 6 覆盖旧任务中的“只作用于控制器拖动”范围，并以最新 `spec.md` 和 `plan.md` 为准。

### 可并行机会

- T016、T017、T018 涉及不同文档文件，可在运行时接口稳定后并行处理。
- 几何测试与组件契约测试关注文件不同，但同阶段仍按测试先于实现的门禁执行。
- T030 的四份文档在 T027-T029 接口稳定后可并行校对，但同一任务内统一提交以确保中英文表述一致。

## 实施策略

### MVP 优先

1. 完成 T001。
2. 先完成并运行失败测试 T002-T004。
3. 完成 T005-T007，交付固定比例缩放。
4. 再进入可配置尺寸范围与组合约束。

### 增量交付

1. **US1**：任意固定比例、四角锚点和四边中心对称。
2. **US2**：最小/最大宽高及比例、容器组合。
3. **US3**：README、指南、参数页和全功能 Demo。
4. **收口**：浏览器交互、完整检查和范围复核。

## 备注

- 不添加运行时校验、自动纠错、错误提示或无效配置兜底。
- Phase 6 已由用户确认修改初始及运行时 `cropLayout`、`setCropLayout()` 和 `reset()` 在限制开关开启时的实际尺寸；`setCropAxis()` 保持不变。
- 不修改裁剪框视觉、九宫格显示时机、图片拖动、图片缩放或图片回弹规则。
- 完成每项任务后在本文件把对应复选框标记为 `[x]`。
