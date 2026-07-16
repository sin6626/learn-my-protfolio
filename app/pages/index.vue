/**
 * 首页 (路由 /)
 * - 由 index.yml 内容集合驱动,通过 Landing* 分区组件拼装内容
 * - 区块顺序: Hero (主视觉) → About + WorkExperience (简介 + 工作经历) → Blog (博客精选) → Testimonials (推荐语) → FAQ (常见问题)
 * - 设置页面级 SEO 信息
 */

<script setup lang="ts">
// 从 index 集合中取首条记录 (index.yml 仅有单条首页数据)
// useAsyncData 是一个可组合的元素，可以直接在 Nuxt 上下文中被调用。它会返回响应式组合体，并负责将响应式的元素添加到 Nuxt 负载中，这样就能在页面刷新时，从服务器传递到客户端，而无需在客户端重新获取数据。
// 第一个参数是key, 这个key随便什么都可以, 在别的页面内使用也使用了useAsyncData, 相同的key就可以得到相同的结果,相当于一次缓存, 节省了宽带
// Nuxt Content 里面维护了一张key -> 集合映射类型表('index'-> IndexCollectionItem)
// 使用index当做key, 就会返回IndexCollectionItem类型, 不是普通的ref类型, 这样可以使用Ts的类型推断, 就有了代码提示
// {data: page} 从返回中解构出data并且重新命名为page

// 这下面是一种官方很标准的写法, 在Nuxt Content里面
// 地址 https://nuxt.com/docs/4.x/directory-structure/content#render-content
const { data: page } = await useAsyncData('index', () => {
  // https://content.nuxt.com/docs/utils/query-collection
  // first 返回查询成功后的第一个查询结果
  // 下面的index指的是在content里面的index集合
  return queryCollection('index').first()
})

// 内容不存在时返回 404 致命错误,触发 Nuxt 错误页
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// 设置 SEO 元信息: 优先取 seo 字段,fallback 到页面标题/描述
useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  // 设计用于社交平台分享时候展示的标题
  ogTitle: page.value?.seo.title || page.value?.title,
  // 搜索引擎搜索结果中显示的简介
  description: page.value?.seo.description || page.value?.description,
  // 社交卡片分享时显示的副文本
  ogDescription: page.value?.seo.description || page.value?.description,
  // 分享时候的卡片封面图
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/portfolio-light.png'
})
</script>

<template>
  <UPage v-if="page">
    <!-- 主视觉区: 头像、标题、描述、CTA、跑马灯图片 -->
    <LandingHero :page />

    <!-- 简介 + 工作经历 (大屏两列布局) -->
    <!-- pt-0! 后面!是强值班也就是!import, lg:表示在屏宽超过1024的情况下, grid-cols-2是分成两行展示, about在做, workexperience在右 -->
    <UPageSection
      :ui="{
        container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>

    <!-- 博客精选 -->
    <LandingBlog :page />

    <!-- 推荐语轮播 -->
    <LandingTestimonials :page />

    <!-- 常见问题 (Tabs + Accordion) -->
    <LandingFAQ :page />
  </UPage>
</template>
