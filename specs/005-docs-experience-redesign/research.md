# Research: 文档重构

日期：2026-09-21。依据：audit、仓库源码、只读研究子任务 `docs_design_research` 与设计稿浏览器检查。

## 技术承载

**Decision**: 保留现有 Vue/Vite/Markdown 体系和依赖。
**Rationale**: 自定义画布、场景和工作台已具备交互能力，文档组织与视觉均能在现有体系实现。
**Alternatives considered**: 文档框架迁移会扩大路由、演示编译和样式迁移范围，当前需求没有要求这项变化。

## 导航与布局

**Decision**: 以 `src/docs/navigation.ts` 提供共享元数据，使用首页、阅读和工作台布局；保留原 20 路由。
**Rationale**: `src/main.ts` 与 `SideBar.vue` 当前重复维护路径和标题，元数据可直接服务导航、目录和相邻页。
**Alternatives considered**: 继续分散维护会使中英文和新增概念入口容易不一致；重命名所有路由会影响现有访问契约。

## 本页目录

**Decision**: 用稳定的显式章节 ID 和共享目录定义，路由对象携带章节 hash，在内容挂载后定位。
**Rationale**: 当前 Markdown 没有标题锚点插件，中英文文字不同；稳定 ID 可避免按翻译后标题生成 ID 的分歧。
**Alternatives considered**: 根据运行时 DOM 猜测章节或增加标题插件均非必要；禁止用裸 `#section` 替换现有 `#/guide`。

## 示例可复制性

**Decision**: 独立 SFC 代码资产通过 `?raw` 展示，普通演示继续运行当前逻辑；用户的代码只依赖公开包和明确图片输入。
**Rationale**: `DemoBasic.md` 引用了私有语言与示例组件，场景代码缺少组件/样式引入且直接调用占位服务。完整代码应可以独立得到本地结果。
**Alternatives considered**: 直接展示站内组件源码不足以满足接入要求；引入在线代码执行器超出范围。

## 双语

**Decision**: 保留 `useLocale`、现有 storage key 与 `LangBlock`，公共标签集中双语定义。
**Rationale**: 原有机制已可满足同主题切换；遗漏来自公共操作文案，不必迁移整套语言系统。
**Alternatives considered**: 新国际化框架与缺失翻译兜底没有必要。

## 视觉

**Decision**: 暖白、深绿、细边线、裁剪角标，图像优先的首页、控制正文宽度的文档、独立宽画布工作台。
**Rationale**: 视觉元素来自组件本身的操作与几何特征，三类页面分别服务展示、学习和组合验证。
**Alternatives considered**: 全站相同固定窄栏不适合编辑画布；大量纯装饰动效不帮助理解组件。

## 已解决的关键未知项

路由策略、目录 ID、滚动容器、示例代码组织、语言维护方式、素材来源和设计基调均已有明确选择。剩余是计划确认与后续实现验收，无 NEEDS CLARIFICATION 技术未知项。
