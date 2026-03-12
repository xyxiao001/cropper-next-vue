import { createApp } from 'vue'
import App from './App.vue'
import Demo from './components/Demo.vue'
import LangBlock from './components/LangBlock.vue'
import LangText from './components/LangText.vue'
import DemoImageSwitch from './components/DemoImageSwitch.vue'
import CropExportPanel from './components/CropExportPanel.vue'
import { createRouter, createWebHashHistory} from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VueCropper from '../lib';
// import VueCropper from 'cropper-next-vue';
// import { VueCropper } from 'cropper-next-vue';
// import 'cropper-next-vue/style.css'


const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: () => import('./pages/Home.vue')
    },
    {
      name: 'Guide',
      path: '/guide',
      component: () => import('./pages/Guide.md'),
    },
    {
      name: 'Props',
      path: '/props',
      component: () => import('./pages/Props.md'),
    },
    {
      name: 'Methods',
      path: '/methods',
      component: () => import('./pages/Methods.md'),
    },
    {
      name: 'Changelog',
      path: '/changelog',
      component: () => import('./pages/Changelog.md'),
    },
    {
      name: 'Event',
      path: '/event',
      component: () => import('./pages/Event.md'),
    },
    {
      name: 'DemoBasic',
      path: '/demo-basic',
      component: () => import('./pages/DemoBasic.md'),
    },
    {
      name: 'DemoLoading',
      path: '/demo-loading',
      component: () => import('./pages/DemoLoading.md'),
    },
    {
      name: 'DemoDrag',
      path: '/demo-drag',
      component: () => import('./pages/DemoDrag.md'),
    },
    {
      name: 'DemoCrop',
      path: '/demo-crop',
      component: () => import('./pages/DemoCrop.md'),
    },
    {
      name: 'DemoImg',
      path: '/demo-img',
      component: () => import('./pages/DemoImg.md'),
    },
    {
      name: 'DemoFilter',
      path: '/demo-filter',
      component: () => import('./pages/DemoFilter.md'),
    },
    {
      name: 'DemoRotate',
      path: '/demo-rotate',
      component: () => import('./pages/DemoRotate.md'),
    },
    {
      name: 'DemoRealtime',
      path: '/demo-realtime',
      component: () => import('./pages/DemoRealtime.md'),
    },
    {
      name: 'DemoExport',
      path: '/demo-export',
      component: () => import('./pages/DemoExport.md'),
    },
    {
      name: 'DemoAll',
      path: '/demo-all',
      component: () => import('./pages/DemoAll.md'),
    },
  ], // `routes: routes` 的缩写
})

const app = createApp(App)
app.use(ElementPlus)
app.use(VueCropper)
app.use(router)
app.component('demo', Demo)
app.component('LangBlock', LangBlock)
app.component('LangText', LangText)
app.component('DemoImageSwitch', DemoImageSwitch)
app.component('CropExportPanel', CropExportPanel)
app.mount('#app')
