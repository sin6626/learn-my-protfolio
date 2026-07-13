/**
 * 博客详情页 (动态路由 /blog/**)
 * - 通过 route.path 匹配 blog 集合中对应文章
 * - 加载相邻文章列表 (surround) 用于上一篇/下一篇导航
 * - 渲染标题、日期、阅读时长、封面、正文、作者信息、复制链接按钮
 * - 优先使用文章自带图片作 OG 图,否则用 OgImage 模板生成
 */

<script setup lang="ts">
// 获取当前路由信息 (路径作为 useAsyncData 的 key)
const route = useRoute()

// 按当前路径取文章内容
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
// 找不到文章抛 404
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

// 取相邻文章 (上一篇/下一篇,仅需 description 字段)
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

// 计算 SEO 信息
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

// OG 图: 文章有封面图就用封面图,否则用模板生成
if (page.value.image) {
  useSeoMeta({ ogImage: page.value.image })
} else {
  defineOgImage('Portfolio', {
    title,
    description,
    headline: 'Blog'
  })
}

// 当前页面 URL (客户端计算,用于"复制链接"功能)
const articleLink = computed(() => `${window?.location}`)

// 格式化日期为 "月 日, 年" (如 Mar 5, 2024)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <!-- 返回博客列表的返回链接 -->
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>

        <!-- 文章头部: 日期 + 阅读时长 / 封面图 / 标题 / 描述 / 作者 -->
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead">
              -
            </span>
            <span v-if="page.minRead">
              {{ page.minRead }} MIN READ
            </span>
          </div>

          <!-- 文章封面图 -->
          <NuxtImg
            v-if="page.image"
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full h-[300px] object-cover object-center"
          />

          <!-- 文章标题 -->
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>

          <!-- 文章描述 -->
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>

          <!-- 作者信息卡片 -->
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              v-bind="page.author"
            />
          </div>
        </div>

        <!-- 文章正文与底部操作 -->
        <UPageBody class="max-w-3xl mx-auto">
          <!-- Nuxt Content 渲染 Markdown 正文 -->
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <!-- 复制当前文章链接 -->
          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
          </div>

          <!-- 上一篇/下一篇导航 -->
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
