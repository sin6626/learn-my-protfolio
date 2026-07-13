/**
 * 首页 (路由 /)
 * - 由 index.yml 内容集合驱动,通过 Landing* 分区组件拼装内容
 * - 区块顺序: Hero (主视觉) → About + WorkExperience (简介 + 工作经历) → Blog (博客精选) → Testimonials (推荐语) → FAQ (常见问题)
 * - 设置页面级 SEO 信息
 */

<script setup lang="ts">
// 从 index 集合中取首条记录 (index.yml 仅有单条首页数据)
const { data: page } = await useAsyncData('index', () => {
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
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/portfolio-light.png'
})
</script>

<template>
  <UPage v-if="page">
    <!-- 主视觉区: 头像、标题、描述、CTA、跑马灯图片 -->
    <LandingHero :page />

    <!-- 简介 + 工作经历 (大屏两列布局) -->
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
