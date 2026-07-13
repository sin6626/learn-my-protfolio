/**
 * 错误页面 (404 / 500 等运行时错误)
 * - 由 Nuxt 自动加载并传入 error prop
 * - 复用站点的顶部导航、页脚与内容搜索浮层,保持错误页与正常页一致体验
 */

<script setup lang="ts">
import type { NuxtError } from '#app'

// 接收 Nuxt 传入的错误对象 (statusCode / statusMessage 等)
defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

// 错误页同样需要设置语言属性
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

// 错误页 SEO 信息 (默认提示为未找到页面)
useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

// 与 app.vue 一致: 并行加载博客导航与搜索数据,供搜索浮层使用
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
  <div>
    <!-- 顶部浮动导航 (复用主站组件) -->
    <AppHeader :links="navLinks" />

    <UMain>
      <UContainer>
        <UPage>
          <!-- Nuxt UI 内置错误展示组件,渲染 error.statusCode / message -->
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 全站搜索浮层 (客户端渲染) -->
    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>

    <!-- Toast 容器,用于全局消息提示 (错误页可能也会触发 toast) -->
    <UToaster />
  </div>
</template>
