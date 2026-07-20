/**
 * 应用根组件
 * - 挂载 Nuxt UI 的 UApp 顶层组件 (提供主题/颜色模式上下文)
 * - 通过 NuxtLayout 渲染布局,通过 NuxtPage 渲染路由页面
 * - 在客户端渲染全站内容搜索浮层 (LazyUContentSearch)
 * - 配置全局 SEO 元信息 (字符集、视口、主题色、favicon、SEO 标题模板)
 */

<script setup lang="ts">
// 获取当前颜色模式 (dark / light),用于动态设置浏览器主题色
// useColorMode 是来自Nuxt/ColorMode里面的composable, NuxtUI里面自带的依赖
const colorMode = useColorMode()

// 根据当前颜色模式计算主题色 (暗色为深蓝,亮色为白色)
const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// 配置 HTML 根节点及全局 meta 标签, 提升SEO
useHead({
  meta: [
    { charset: 'utf-8' },
    // viewport 是用来适配移动端, width=device-width 就是页面的宽度是他屏幕的宽度, initial-scale=1 就是不用缩放, 一开始就是100%
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // 随颜色模式动态变化的浏览器 UI 主题色
    // 他不是改浏览器内容的UI主题色, 而是浏览器顶部的, 要在手机上看才明显
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  // 配置favicon
  link: [
    { rel: 'icon', href: '/Devil.ico' }
  ],
  // 配置页面语言, 告诉搜索引擎是什么语言
  // 中文网站 => zh-CN
  htmlAttrs: {
    lang: 'en'
  }
})

// 配置 SEO 元信息: 标题模板与 Twitter 卡片类型
useSeoMeta({
  // %s 表示每个页面自己的title, 也就是给每个页面加上了后缀
  titleTemplate: '%s - 测试Nuxt Portfolio Template',
  // 控制别人分享你的网站链接时，Twitter/X 如何展示.(感觉用不到....)
  twitterCard: 'summary_large_image'
})

// 并行加载导航数据与搜索数据
// - navigation: blog 集合的导航树,用于搜索浮层左侧导航
// - files: blog 集合中的可搜索分段,仅在客户端加载 (server: false)

// Promise.all(), 并发执行异步操作, 可以一次性拿回多个异步操作的值
const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      // queryCollectionNavigation, 生成给定集合的导航树结构
      queryCollectionNavigation('blog')
    ])
  }, {
  // 这里的flat()是Ts数组中的方法, 表示展开一层数组, 默认展开一层
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      // queryCollectionSearchSections: 从特定的集合生成可以搜索的章节
      // 相当于是一个文章的粉碎机, 把文章下面的子标题也当做可以搜索的索引, 他不仅仅可以搜索文章的title, 还可以搜索文章下面的子标题(例如h2)
      // 必须要配合queryCollectionNavigation一起使用
      queryCollectionSearchSections('blog')
    ])
  }, {
    server: true,
    transform: data => data.flat()
  })
])
// console.log(navigation.value)
// navigation.value = undefined
// console.log('-------------------------')
// console.log(files.value)
// files.value = undefined
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
    <!-- shortcut是更换搜索框的快捷键, 默认是ctrl + k(meta_k) -->
    <!-- 下面的navLinks是在utils文件下导出使用的 -->
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
