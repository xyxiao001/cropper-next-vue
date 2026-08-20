# 状态模型：裁剪状态与交互控制

## 裁剪状态

`change` 事件每次返回一个完整快照：

```text
CropperState
├── image
│   ├── x: number
│   ├── y: number
│   ├── scale: number
│   └── rotate: number
└── crop
    ├── x: number
    ├── y: number
    ├── width: number
    └── height: number
```

### 字段规则

- `image.x/y`：缩放后图片左上角在组件容器坐标系中的位置。
- `image.scale`：当前图片缩放倍数。
- `image.rotate`：当前归一化或累计使用的旋转角度，与现有图片轴保持一致。
- `crop.x/y`：裁剪框左上角在组件容器坐标系中的位置。
- `crop.width/height`：当前生效的裁剪框尺寸，不能超过容器尺寸。

## 交互配置

```text
InteractionConfig
├── movable: boolean = true
└── zoomable: boolean = true
```

- `movable` 只控制用户拖拽。
- `zoomable` 只控制用户滚轮和双指缩放。
- 两者均不控制公开实例方法。

## 状态变化

```text
图片加载完成 ──→ 初始状态 ──→ 用户/公开方法修改 ──→ 当前状态
                        └──── reset() ─────────────→ 初始状态
```

- 每个可观察状态完成后排队一次 `change` 快照。
- 连续同步修改在同一动画帧内合并为最终快照。
- 导出不改变状态，因此不产生状态事件。
