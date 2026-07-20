/**
 * 首页 Blog 精选区
 * - 直接从 blog 集合取最新 3 篇文章 (按日期倒序)
 * - 使用 UBlogPost 横向卡片布局,带"Read Article"按钮动画
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// 接收首页数据 (取 blog 字段中的标题与描述)
defineProps<{
  page: IndexCollectionItem
}>()

// 取最新的 3 篇博客文章 (按日期倒序)
const { data: posts } = await useAsyncData('index-blogs', () =>
  // all() 才是最后真正查询, 前面的语句都类似于构建sql而已, 除了all(), 还可以使用first(), 返回第一条符合的数据, one() 取唯一的一条, 没有就跑错误
  queryCollection('blog').order('date', 'DESC').limit(3).all()
)
if (!posts.value) {
  // Nuxt里面的api, 地址: https://nuxt.com/docs/4.x/api/utils/create-error
  // fatal 设置为true, 触发全屏错误页面, 会直接展示error.vue页面
  throw createError({ statusCode: 404, statusMessage: 'blogs posts not found', fatal: true })
}
</script>

<template>
  <UPageSection
    :title="page.blog.title"
    :description="page.blog.description"
    :ui="{
      container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <UBlogPosts
      orientation="vertical"
      class="gap-4 lg:gap-y-4"
    >
      <!-- 单个文章卡片 (横向布局,无卡片背景样式) -->
      <!-- 下面的:to="post.path", to就是ULink的to, page属性是NuxtContent自动生成的, 不会显示的写在post对应的集合中, 加了to这个属性的组件, 会整个都变成一个可以跳转的链接, 鼠标悬浮会变成一个小手 -->
      <!-- v-bind里面明明绑定了那么多UBlogPost需要的属性, 但是却很多都没有生效, 是因为下面的ui插槽的设置 -->
      <!-- header: hidden, 对应display: none, 把会显示在header部分的内容全部都给隐藏了 -->
      <!-- 有关Tailwind中group属性地址: https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-the-descendants-of-a-group -->
      <!-- 在Tailwind中, 有hover: 可以使用, 当鼠标悬浮在元素上的时候会生效, 但是如果是一个div 里面包裹着img, 我想要当我鼠标悬浮的div的时候, 我的img元素也能有变化. 在Tailwind中, img元素并不知道div元素有没有被鼠标悬浮, 这时候就可以使用group, 使用group绑定了父元素div, 然后子元素使用group-hover: 就可以监听到父元素的变化了 -->
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        orientation="horizontal"
        variant="naked"
        v-bind="post"
        :to="post.path"
        :ui="{
          root: 'group relative lg:items-start lg:flex ring-0 hover:ring-0',
          body: 'px-0!',
          header: 'hidden'
        }"
      >
        <!-- 底部 "Read Article" 链接按钮 (hover 时右移渐显) -->
        <template #footer>
          <UButton
            size="xs"
            variant="link"
            class="px-0 gap-0"
            label="Read Article"
          >
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </template>
          </UButton>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UPageSection>
</template>
