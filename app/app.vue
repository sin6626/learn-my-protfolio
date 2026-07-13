/**
 * 应用根组件
 * - 挂载 Nuxt UI 的 UApp 顶层组件 (提供主题/颜色模式上下文)
 * - 通过 NuxtLayout 渲染布局,通过 NuxtPage 渲染路由页面
 * - 在客户端渲染全站内容搜索浮层 (LazyUContentSearch)
 * - 配置全局 SEO 元信息 (字符集、视口、主题色、favicon、SEO 标题模板)
 */

<script setup lang="ts">
// 获取当前颜色模式 (dark / light),用于动态设置浏览器主题色
const colorMode = useColorMode()

// 根据当前颜色模式计算主题色 (暗色为深蓝,亮色为白色)
const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// 配置 HTML 根节点及全局 meta 标签
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // 随颜色模式动态变化的浏览器 UI 主题色
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// 配置 SEO 元信息: 标题模板与 Twitter 卡片类型
useSeoMeta({
  titleTemplate: '%s - Nuxt Portfolio Template',
  twitterCard: 'summary_large_image'
})

// 并行加载导航数据与搜索数据
// - navigation: blog 集合的导航树,用于搜索浮层左侧导航
// - files: blog 集合中的可搜索分段,仅在客户端加载 (server: false)
const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      queryCollectionNavigation('blog')
    ])
  }, {
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      queryCollectionSearchSections('blog')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  })
])
</script>

<template>
  <!-- Nuxt UI 顶层应用组件,提供全局 UI 上下文、颜色模式支持、Toast 等基础能力 -->
  <UApp>
    <!-- 默认布局包裹,内部渲染当前路由对应的页面 -->
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>

    <!-- 仅在客户端渲染的全站内容搜索浮层 -->
    <!-- 使用 ClientOnly 包裹避免 SSR 时缺少 navigator/window 导致水合错误 -->
    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
