# Tasks: 文档站体验重构

依据已确认 spec 与 plan。保留旧路由、库行为、图片来源和错误处理。

## Phase 1: Setup
- [x] T001 核对忽略规则与当前基线，确认 `lib/` 不在修改范围；记录 `specs/005-docs-experience-redesign/plan.md` 确认状态。

## Phase 2: Foundation
- [x] T002 在 `tests/docs-navigation.test.ts`、`tests/docs-interactions.test.ts` 建立旧路由与代码工具栏回归。
- [x] T003 实现 `src/docs/navigation.ts`、`src/assets/tokens.scss`、`src/assets/index.scss` 的共享导航与视觉基础。
- [x] T004 实现 `src/components/SiteHeader.vue`、`SideBar.vue`、`DocLayout.vue`、`PageOutline.vue` 和 `src/App.vue`，接入双语章节、上下篇与移动布局。

## Phase 3: US1 首次接入
独立验收：首页进入快速开始，复制公开包示例完成导出。
- [x] T005 [US1] 重构 `src/pages/Home.vue`，保留实际裁剪、原控制项与导出流程，加入场景入口和示例配置说明。
- [x] T006 [US1] 新建 `src/examples/BasicCrop.vue`，重写 `src/pages/Guide.md`，补 `tests/docs-examples.test.ts` 的编译及接入检查。

## Phase 4: US2 理解概念
独立验收：解释容器/选区/输出，并找到比例、边界与 Blob 任务。
- [x] T007 [US2] 新建 `src/pages/Concepts.vue` 并在 `src/main.ts` 注册，加入双语图示、章节与主题链接。
- [x] T008 [US2] 重组 `src/pages/Props.md`、`Methods.md`、`Event.md` 与 `DemoImg.md`，核对默认值、覆盖语义、导出尺寸和返回类型，保留全部公开条目。

## Phase 5: US3 场景与查阅
独立验收：三个场景和十一示例的用途、运行演示、完整代码与参考均可达。
- [x] T009 [US3] 统一 `src/components/Demo.vue`、`ScenarioCodeExample.vue`，在 `src/docs/examples.ts` 对接完整独立代码；创建 `src/examples/AvatarCrop.vue`、`CoverCrop.vue`、`ProductCrop.vue` 及各功能示例代码。
- [x] T010 [US3] 更新 `src/pages/ScenarioAvatar.vue`、`ScenarioCover.vue`、`ScenarioProduct.vue` 的代码与关联入口；给 `DemoBasic.md`、`DemoExport.md`、`DemoCrop.md`、`DemoRotate.md`、`DemoRealtime.md`、`DemoDrag.md`、`DemoLoading.md`、`DemoFilter.md` 和 `DemoGeometry.vue` 提供独立接入代码与一致说明。

## Phase 6: US4 一致体验
独立验收：中英文、手机、键盘、章节深链接可用。
- [x] T011 [US4] 统一 `src/components/LocaleSwitch.vue`、`DemoImageSwitch.vue`、`CropExportPanel.vue`、`src/pages/DemoAll.vue`、`DemoGeometry.vue` 和其余文档的展示样式，保持现有逻辑。
- [x] T012 [US4] 补齐 `tests/docs-interactions.test.ts` 双语/章节/复制测试，浏览器核对 375/768/1440px 阅读和核心操作。

## Phase 7: Validation
- [x] T013 执行 typecheck、相关 Vitest、build:docs、diff 检查；在 `specs/005-docs-experience-redesign/validation.md` 记录结果。
- [x] T014 按 converge 对照 `specs/005-docs-experience-redesign/spec.md` 检查差距并完成范围内剩余实现，记录真实读者验收仍待开展。

## Dependencies
T001 → T002–T004 → US1 → US2 → US3 → US4 → T013–T014。
共享文件顺序修改。US1 首页与接入示例、US2 概念与参考内容、US3 三个场景可由不同开发者并行，但本次按顺序执行，避免共享样式冲突。

## Strategy and Coverage
先完成 shell 与首页可见增量，再补内容、示例和交互，最后完整验证。
FR-001/003/015 → T005/T006；FR-002/011/012/014 → T003/T004/T012；FR-004/005 → T007/T008；FR-006/007/008 → T008–T010；FR-009/010/013 → T003/T011/T012；FR-016 → T001/T013/T014。
SC-001/002 需真实用户测试，不声称代理已通过。其余成功标准由上述实现与 T013/T014 覆盖。

## Phase 8: Convergence
- [x] T015 补齐 `src/components/PageOutline.vue` 手机端目录折叠及回归测试，统一新增页面辅助文字最小字号，并修正残余英文边界表述；依据 FR-010/013/014、plan: Visual Design（partial，MEDIUM）。
- [x] T016 完成桌面全路由与核心中英导出交互复核，在 `validation.md` 记录独立示例导出证据及最终构建/测试结果；依据 SC-005/006/007（partial，MEDIUM）。

## Phase 9: 逐页深入体验（用户追加要求）
- [x] T017 实际体验全部页面的主要控件、业务流程、中英文阅读和三档视口，修复发现的文档站样式及交互问题；详细证据与未验证项记录在 `experience-audit.md`。
- [x] T018 为封面预览随卡片宽度变化补回归测试，完成类型检查、文档测试、构建与 diff 检查。
