import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import mdConfig from './md.config'

const markdownRenderer = new MarkdownIt()

export default defineConfig({
  build: {
    outDir: 'docs-dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('element-plus')) {
            return 'vendor-element-plus'
          }

          if (id.includes('highlight.js')) {
            return 'vendor-highlight'
          }

          if (id.includes('/vue/') || id.includes('vue-router')) {
            return 'vendor-vue'
          }

          return 'vendor'
        },
      },
    },
  },
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
        xhtmlOut: true,
        highlight: (str: string, lang: string) => {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang }).value +
                '</code></pre>';
            } catch (__) {
            }
          }
          return '<pre class="hljs"><code>' + markdownRenderer.utils.escapeHtml(str) + '</code></pre>';
        }
      },
      markdownItSetup(md) {
        mdConfig(md);
        // md.use(require('markdown-it-anchor'))
        // md.use(require('markdown-it-prism'))
      },
      wrapperClasses: 'markdown-body',
    }),
  ]
})
