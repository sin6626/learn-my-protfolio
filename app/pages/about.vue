/**
 * 关于页 (/about)
 * - 由 about.yml 内容集合驱动
 * - 横向 Hero: 文字 + 头像 (按颜色模式切换图片)
 * - 正文使用 MDC 渲染,底部展示拍立得风格图片集
 * - 生成自定义 OG 分享图
 */

<script setup lang="ts">
// 从 about 集合取首条记录 (about.yml)
const { data: page } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})

// 内容缺失抛 404 致命错误
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// 取全局配置 (头像、邮箱等)
const { global } = useAppConfig()

// 计算 SEO 标题与描述,优先取 seo 字段,fallback 到页面标题/描述
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

// 设置 SEO 元信息
useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

// 使用 OgImage/Portfolio.takumi.vue 模板生成 OG 图
defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="page">
    <!-- 横向 Hero: 左侧文字,右侧头像 -->
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <!-- 按颜色模式切换的头像组件 (亮/暗分别使用不同图片) -->
      <UColorModeAvatar
        class="sm:rotate-4 size-36 rounded-lg ring ring-default ring-offset-3 ring-offset-bg"
        :light="global.picture?.light!"
        :dark="global.picture?.dark!"
        :alt="global.picture?.alt!"
      />
    </UPageHero>

    <!-- 正文内容: MDC 渲染,unwrap="p" 表示去掉顶层 p 包裹 -->
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <MDC
        :value="page.content"
        unwrap="p"
      />

      <!-- 拍立得风格图片集 (左右轮换微旋转) -->
      <div class="flex flex-row justify-center items-center py-10 -space-x-8">
        <PolaroidItem
          v-for="(image, index) in page.images"
          :key="index"
          :image="image"
          :index
        />
      </div>
    </UPageSection>
  </UPage>
</template>
