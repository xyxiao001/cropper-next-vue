export type LocalizedText = { zh: string; en: string }
export type DocPage = {
  path: string
  title: LocalizedText
  summary: LocalizedText
  group: string
  layout: 'home' | 'article' | 'workspace'
  related: string[]
}
const page = (path: string, zh: string, en: string, group: string, summaryZh: string, summaryEn: string, related: string[] = [], layout: DocPage['layout'] = 'article'): DocPage => ({ path, title: { zh, en }, summary: { zh: summaryZh, en: summaryEn }, group, related, layout })
export const docGroups: Record<string, LocalizedText> = {
  start: { zh: '开始使用', en: 'GET STARTED' },
  concepts: { zh: '理解裁剪', en: 'CORE CONCEPTS' },
  scenarios: { zh: '场景实践', en: 'REAL-WORLD' },
  demos: { zh: '探索能力', en: 'EXPLORE' },
  reference: { zh: 'API 参考', en: 'REFERENCE' },
}
export const docPages: DocPage[] = [
  page('/', '首页', 'Home', 'start', '', '', ['/guide', '/demo-all'], 'home'),
  page('/guide', '快速开始', 'Quick start', 'start', '从安装到第一张裁剪图，完成一次完整接入。', 'From installation to your first crop. A complete integration.', ['/concepts', '/demo-basic']),
  page('/concepts', '认识裁剪组件', 'How cropping works', 'concepts', '先认识容器、图片与裁剪框，再决定需要哪些设置。', 'Understand the workspace, image and crop box before choosing your settings.', ['/demo-crop', '/demo-img', '/demo-export']),
  page('/scenario-avatar', '头像上传', 'Profile photo', 'scenarios', '选取正方形区域，在个人资料中预览你的新头像。', 'Compose a square crop and preview your new profile photo.', ['/demo-crop', '/event']),
  page('/scenario-cover', '文章封面', 'Article cover', 'scenarios', '为内容找到合适的 16:9 构图。', 'Find the right 16:9 composition for your story.', ['/demo-img', '/demo-export']),
  page('/scenario-product', '商品主图', 'Product image', 'scenarios', '统一主图比例，控制导出格式与文件质量。', 'Keep product images consistent and choose export format and quality.', ['/demo-export', '/props']),
  page('/demo-basic', '基础裁剪', 'Basic cropping', 'demos', '拖动、缩放、导出，体验最常用的裁剪流程。', 'Drag, zoom and export. Try the essential crop workflow.', ['/guide', '/demo-export']),
  page('/demo-crop', '裁剪框与比例', 'Crop box & ratio', 'demos', '调整选区，理解自由缩放、固定比例和尺寸限制。', 'Adjust the selection with free resizing, aspect ratios and size constraints.', ['/concepts', '/props']),
  page('/demo-img', '布局与边界', 'Layout & boundaries', 'demos', '让图片覆盖选区或整个工作区，理解两种边界策略。', 'Keep the selection or the entire workspace covered by the image.', ['/concepts', '/props']),
  page('/demo-rotate', '旋转控制', 'Rotation', 'demos', '旋转画面，观察图片与边界的关系。', 'Rotate the image and observe how the boundary responds.', ['/methods', '/demo-geometry']),
  page('/demo-realtime', '实时预览', 'Live preview', 'demos', '把当前选区同步显示在业务界面中。', 'Reflect the current selection in your own interface.', ['/event', '/scenario-avatar']),
  page('/demo-export', '导出图片', 'Export images', 'demos', '区分显示尺寸与导出像素，获得 base64 或 Blob。', 'Understand display size and export pixels; get base64 or Blob output.', ['/methods', '/props']),
  page('/demo-geometry', '翻转与源图坐标', 'Flips & coordinates', 'demos', '翻转图片，读取选区在源图中的角点和包围盒。', 'Flip the image and read crop corners in source-image coordinates.', ['/methods', '/event']),
  page('/demo-drag', '本地图片', 'Local images', 'demos', '从本地选择图片，或拖入裁剪工作区。', 'Select a local image or drop it into the crop workspace.', ['/event', '/scenario-avatar']),
  page('/demo-loading', '加载插槽', 'Loading slot', 'demos', '为图片加载过程提供自己的展示内容。', 'Provide your own content while an image loads.', ['/event', '/guide']),
  page('/demo-filter', '图片滤镜', 'Image filters', 'demos', '通过画布滤镜处理图片，观察预览和导出结果。', 'Process the source canvas and inspect the preview and export.', ['/props', '/demo-export']),
  page('/demo-all', '完整工作台', 'Playground', 'demos', '组合配置，观察状态，验证你的裁剪方案。', 'Combine settings, inspect state and test your integration.', ['/props', '/methods'], 'workspace'),
  page('/props', '参数', 'Props', 'reference', '按任务查找配置，了解默认值和参数间的关系。', 'Find options by task, with defaults and related settings.', ['/demo-all', '/concepts']),
  page('/methods', '实例方法', 'Methods', 'reference', '通过组件引用导出图片、调整几何和重置状态。', 'Export images, adjust geometry and reset state through the component reference.', ['/demo-geometry', '/demo-export']),
  page('/event', '事件与预览', 'Events & preview', 'reference', '接收图片加载、实时预览和裁剪状态的变化。', 'Listen to image loading, live preview and crop-state changes.', ['/demo-realtime', '/demo-loading']),
  page('/changelog', '版本记录', 'Changelog', 'reference', '了解各版本的功能变化。', 'See what changed in each release.', ['/guide']),
]
