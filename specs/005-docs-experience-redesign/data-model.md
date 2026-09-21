# Data Model: 文档站元数据与展示状态

无后端或新持久化。以下均为文档内部模型，不是库公开 API。

## DocPage

- `path`：现有路径或新概念页 `/concepts`。
- `title`、`summary`：`zh/en` 文案。
- `group`：入门、概念、场景、示例、API、版本记录。
- `layout`：home、article、workspace。
- `sections`：DocSection 列表。
- `previous`、`next`：明确的学习路径链接。
- `related`：关联 DocPage 与章节引用。

路径、章节引用与旧路由完整性通过测试核对；不增加运行时拦截或兜底。

## DocSection

- `id`：显式且在同一页唯一，语言无关。
- `title`：双语名称。
- `level`：目录层级。

中英文显示互斥，共用同一章节 ID。目录和正文标题契约在内容测试中核对。

## ExampleDocument

- `id`：示例标识。
- `source`：完整 SFC 的原始文本。
- `title`、`purpose`、`instructions`：双语讲解。
- `prerequisites`：依赖和用户提供的图片来源说明。
- `related`：参数、方法或主题链接。

示例文件是可复制代码的唯一来源；运行演示仍调用现有组件，不新增请求流程。

## UI State

- `locale`：沿用已有语言状态及 localStorage。
- `mobileNavigationOpen`：沿用移动导航的临时开关，选择路由后关闭。
- `codeVisible`：示例展开/收起。
- `copied`：沿用复制后的短暂成功反馈，不新增失败兜底。
- `route.path/hash`：当前主题与章节；切换语言不改变路径或章节标识。

裁剪状态、实时预览、源图坐标与导出结果全部沿用库与当前演示的既有模型。
