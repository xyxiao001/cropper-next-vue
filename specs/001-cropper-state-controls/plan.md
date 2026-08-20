# 实现计划：裁剪状态与交互控制

**功能目录**：`001-cropper-state-controls` | **日期**：2026-08-20 | **规格**：[spec.md](./spec.md)

## 概要

在不改变默认行为的前提下，新增 `reset()`、结构化 `change` 事件，以及 `movable`、`zoomable` 两个交互开关。实现复用现有布局计算和状态更新入口；状态事件独立于实时预览生成；交互开关只作用于鼠标和触摸处理器。

## 技术背景

**语言与版本**：TypeScript 5.9、Vue 3.5，Node.js `>=22`

**主要依赖**：Vue 3、Vite 7

**存储**：无持久化存储，状态保存在组件响应式布局容器中

**测试**：Vitest 4、Vue Test Utils、jsdom

**目标平台**：现代桌面与移动浏览器、Vue 3 应用

**项目类型**：可发布的 Vue 组件库及配套文档站

**性能目标**：拖拽和缩放期间每个动画帧最多派发一次结构化状态事件，不新增图片解码或画布导出

**约束**：默认交互完全兼容；`reset()` 不重新加载图片；公开方法不受交互开关限制

**范围**：2 个 props、1 个事件、1 个实例方法、首页示例、API 文档和回归测试

## 章程检查

- [x] 需求范围仅包含已确认的三个 P0 功能。
- [x] 新 props 默认值保持现有行为。
- [x] 图片与裁剪框状态沿用当前容器坐标系。
- [x] 计划包含直接测试、`pnpm run check` 和文档站构建。
- [x] 规格已确认，计划未引入原图坐标、状态恢复输入、撤销栈或额外交互开关。

阶段 1 设计复核结果：通过，无章程例外。

## 项目结构

```text
lib/
├── interface.ts                         # change 事件数据类型
├── vue-cropper.vue                      # props、事件与实例方法装配
└── composables/
    ├── useCropState.ts                  # 结构化状态快照与合并派发
    ├── useCropperEmits.ts               # change 事件发送
    ├── useImagePipeline.ts              # 复用当前图片的初始布局计算
    ├── useInteractions.ts               # movable/zoomable 与待回弹取消
    ├── usePublicMethods.ts              # reset()
    └── useWheelZoom.ts                  # zoomable 控制滚轮

src/pages/
├── Home.vue                             # reset 按钮与交互开关
├── DemoAll.md                           # 完整 API 操作与 change 状态示例
├── Props.md                             # movable/zoomable 文档
├── Methods.md                           # reset 文档
└── Event.md                             # change 文档

tests/
├── useCropState.test.ts                 # 状态快照与合并派发
├── useInteractions.test.ts              # 拖拽/触摸开关与回弹取消
├── useWheelZoom.test.ts                 # 滚轮开关
└── vue-cropper.test.ts                  # 公开 API、reset 与 change 集成
```

**结构选择**：保持现有单组件库结构，只新增一个职责单一的状态 composable，不改变现有模块边界。

## 复杂度跟踪

无章程违规或需要额外说明的复杂度。
