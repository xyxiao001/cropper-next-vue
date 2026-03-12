<template>
  <nav
    class="side-bar"
    :class="{
      'is-mobile': mobile,
      'is-open': open,
    }"
  >
    <header class="side-bar__header">
      <span class="title">cropper-next-vue</span>
      <button
        v-if="mobile"
        class="side-bar__close"
        type="button"
        aria-label="Close menu"
        @click="emit('close')"
      >
        ×
      </button>
    </header>
    <section class="locale-row">
      <LocaleSwitch />
    </section>
    <section class="menu-list">
      <section class="menu-item">
        <router-link class="item-link" to="/" @click="mobile && emit('close')">
          {{ homeLabel }}
        </router-link>
      </section>

      <section class="menu-group" v-for="group in navGroups" :key="group.title">
        <div class="menu-group__title">{{ group.title }}</div>
        <section class="menu-item" v-for="item in group.items" :key="item.path">
          <router-link class="item-link item-link--child" :to="item.path" @click="mobile && emit('close')">
            {{ item.name }}
          </router-link>
        </section>
      </section>
    </section>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import LocaleSwitch from './LocaleSwitch.vue'
  import { useLocale } from '../composables/useLocale'

  const props = defineProps<{
    mobile?: boolean
    open?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  const mobile = computed(() => props.mobile ?? false)
  const open = computed(() => props.open ?? false)

  const { isEn } = useLocale()

  const homeLabel = computed(() => (isEn.value ? 'Home' : '首页'))

  const navGroups = computed(() => [
    {
      title: isEn.value ? 'Docs' : '文档',
      items: [
        {
          name: isEn.value ? 'Guide' : '快速开始',
          path: '/guide'
        },
        {
          name: isEn.value ? 'Props' : '参数',
          path: '/props'
        },
        {
          name: isEn.value ? 'Methods' : '方法',
          path: '/methods'
        },
        {
          name: isEn.value ? 'Changelog' : '版本记录',
          path: '/changelog'
        },
        {
          name: isEn.value ? 'Events' : '事件',
          path: '/event'
        }
      ]
    },
    {
      title: isEn.value ? 'Demos' : '示例',
      items: [
        {
          name: isEn.value ? 'Basic Demo' : '基础例子',
          path: '/demo-basic'
        },
        {
          name: isEn.value ? 'Export' : '导出能力',
          path: '/demo-export'
        },
        {
          name: isEn.value ? 'Full Config' : '全功能配置',
          path: '/demo-all'
        },
        {
          name: isEn.value ? 'Loading Slot' : '替换loading例子',
          path: '/demo-loading'
        },
        {
          name: isEn.value ? 'Upload & Drag' : '本地上传图片例子',
          path: '/demo-drag'
        },
        {
          name: isEn.value ? 'Crop Box' : '截图框操作',
          path: '/demo-crop'
        },
        {
          name: isEn.value ? 'Boundary' : '边界控制',
          path: '/demo-img'
        },
        {
          name: isEn.value ? 'Filter' : '图片滤镜',
          path: '/demo-filter'
        },
        {
          name: isEn.value ? 'Rotation' : '旋转控制',
          path: '/demo-rotate'
        },
        {
          name: isEn.value ? 'Realtime Preview' : '实时预览',
          path: '/demo-realtime'
        }
      ]
    }
  ])
</script>

<style lang="scss">
  @use "../assets/color.scss" as *;
  .side-bar {
    flex-wrap: wrap;
    justify-content: center;
    width: 160px;
    flex-shrink: 0;
    padding: 24px 0 0;
    background-color: white;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .side-bar__header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 0 12px;
  }

  .side-bar__close {
    border: 0;
    background: transparent;
    font-size: 24px;
    line-height: 1;
    color: $G100;
    padding: 6px 8px;
    border-radius: 8px;
  }

  .side-bar.is-mobile {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    max-width: 86vw;
    padding: 16px 0 0;
    padding-top: calc(16px + env(safe-area-inset-top));
    transform: translateX(-100%);
    transition: transform .2s ease-out;
    z-index: 100;
    box-shadow: 0 10px 60px 0 rgba(29,29,31,0.2);
  }

  .side-bar.is-mobile.is-open {
    transform: translateX(0);
  }

  .title {
    display: block;
    text-decoration: none;
    text-align: center;
    line-height: 1.5;
    font-size: 16px;
    background-image: -webkit-linear-gradient(
      left,
      #3498db,
      #f47920 10%,
      #d71345 20%,
      #f7acbc 30%,
      #ffd400 40%,
      #3498db 50%,
      #f47920 60%,
      #d71345 70%,
      #f7acbc 80%,
      #ffd400 90%,
      #3498db
    );
    color: transparent;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    animation: slide 5s infinite linear;
  }

  .menu-list {
    margin-top: 30px;
    outline: none;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background: #fff;
    line-height: 46px;
    transition: background .3s cubic-bezier(.645,.045,.355,1),width .15s cubic-bezier(.645,.045,.355,1);
  }

  .menu-group {
    margin-top: 10px;
  }

  .menu-group__title {
    padding-left: 24px;
    font-size: 12px;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba(0, 0, 0, 0.45);
    text-transform: uppercase;
  }

  .locale-row {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .menu-item {
    position: relative;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    a {
      position: relative;
      display: block;
      padding-left: 24px;
      color: $G100;
      span {
        font-size: 12px;
        margin-left: 6px;
        font-weight: 400;
        opacity: .67;
      }
      &::before {
        position: absolute;
        background-color: transparent;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        content: "";
      }
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        border-right: 3px solid $B50;
        transform: scaleY(0);
        opacity: 0;
        transition: opacity .15s cubic-bezier(.215,.61,.355,1),-webkit-transform .15s cubic-bezier(.215,.61,.355,1);
        transition: transform .15s cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1);
        z-index: 100;
      }
      &.router-link-active {
        color: $B50;
      }
      &.router-link-active::before {
        background-color: $B10;
        opacity: 0.2;
      }
      &.router-link-active::after {
        transform: scaleY(1);
        opacity: 1;
      }
    }
  }

  .item-link {
    &:hover {
      cursor: pointer;
      color: $B50;
    }
  }

  .item-link--child {
    padding-left: 34px;
  }
</style>
