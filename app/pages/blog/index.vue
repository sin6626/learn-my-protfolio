/**
 * 博客列表页 (/blog)
 * - 从 pages 集合取 /blog 页面元信息 (标题/描述/链接)
 * - 从 blog 集合取所有文章,按 date 倒序排列
 * - 使用 UBlogPosts + Motion 实现 staggered 进入动画
 * - 生成自定义 OG 分享图
 */

<script setup lang="ts">
// 取页面元信息 (blog.yml)
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// 取所有博客文章,按日期倒序
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true
  })
}

// 计算 SEO 信息
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="page">
    <!-- 标题 + 描述 -->
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    />

    <!-- 博客文章列表 (垂直方向 + 渐入动画) -->
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <UBlogPosts orientation="vertical">
        <Motion
          v-for="(post, index) in posts"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.2 * index }"
          :in-view-options="{ once: true }"
        >
          <UBlogPost
            variant="naked"
            orientation="horizontal"
            :to="post.path"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
              image:
                `group-hover/blog-post:scale-105 rounded-lg shadow-lg border-4 border-muted ring-2 ring-default `,
              //下面的header必须加overflow-visible, 好像默认是overflow-hidden,不加的话就是当图片的悬浮扩大的时候只有图片有变化
              header:
                index % 2 === 0 ? 'sm:-rotate-1 overflow-visible' : 'sm:rotate-1 overflow-visible'
            }"
          />
        </Motion>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
