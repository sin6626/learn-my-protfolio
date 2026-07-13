// https://nuxt.com/docs/api/configuration/nuxt-config
/**
 * Nuxt 配置文件
 * - 注册所有模块 (ESLint / Image / UI / Content / VueUse / OG 图 / Motion)
 * - 配置全局样式入口、Content 实验特性、Nitro 预渲染规则、ESLint 代码风格、OG 图零运行时模式
 */

export default defineNuxtConfig({
  // 依赖的功能模块
  modules: [
    '@nuxt/eslint', // ESLint 集成
    '@nuxt/image', // 图片优化与 NuxtImg 组件
    '@nuxt/ui', // Nuxt UI 组件库 (含 Tailwind CSS)
    '@nuxt/content', // Nuxt Content 内容管理
    '@vueuse/nuxt', // VueUse 工具集自动导入
    'nuxt-og-image', // 社交分享 OG 图生成
    'motion-v/nuxt' // motion-v 动效组件 (Motion) 自动导入
  ],

  // 启用开发工具
  devtools: {
    enabled: true
  },

  // 全局样式入口
  css: ['~/assets/css/main.css'],

  // Nuxt Content 配置
  content: {
    experimental: {
      // 使用原生 sqlite 连接器 (实验性,性能更好)
      sqliteConnector: 'native'
    }
  },

  // Nuxt 兼容日期
  compatibilityDate: '2026-06-30',

  // Nitro 服务端配置
  nitro: {
    prerender: {
      // 显式预渲染根路径,并启用链接爬取发现更多需预渲染的页面
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  // ESLint 配置: 启用 stylistic 风格规则
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never', // 不使用尾随逗号
        braceStyle: '1tbs' // 1tbs 大括号风格 (else 跟在同一行)
      }
    }
  },

  // nuxt-og-image 配置
  ogImage: {
    // 零运行时模式: OG 图在构建时静态生成,不占用运行时
    zeroRuntime: true
  }
})
