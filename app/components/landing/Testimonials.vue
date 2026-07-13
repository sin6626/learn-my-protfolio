/**
 * 首页推荐语轮播 (Testimonials)
 * - 由 index.yml 的 testimonials 字段驱动
 * - UCarousel 自动播放 4 秒切换,循环,带圆点指示器
 * - 用 UPageCTA 渲染带引号装饰的推荐语 + UUser 展示作者
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// 接收首页数据 (含 testimonials 数组)
defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :ui="{
      container: 'px-0 pt-0!'
    }"
  >
    <!-- 自动轮播: 每条 4 秒切换、循环、带圆点 -->
    <UCarousel
      v-slot="{ item }"
      :items="page.testimonials"
      :autoplay="{ delay: 4000 }"
      loop
      dots
      :ui="{
        viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)'
      }"
    >
      <!-- 单条推荐语: CTA 变体 + 前后大引号装饰 -->
      <UPageCTA
        :description="item.quote"
        variant="naked"
        class="rounded-none"
        :ui="{
          container: 'sm:py-12 lg:py-12 sm:gap-8',
          description: 'text-base! text-balance before:content-[open-quote] before:text-5xl lg:before:text-7xl before:inline-block before:text-dimmed before:absolute before:-ml-6 lg:before:-ml-10 before:-mt-2 lg:before:-mt-4 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:inline-block after:text-dimmed after:absolute after:mt-1 lg:after:mt-0 after:ml-1 lg:after:ml-2'
        }"
      >
        <!-- 作者信息 (头像 + 名字 / 描述),大尺寸 -->
        <UUser
          v-bind="item.author"
          size="xl"
          class="justify-center"
        />
      </UPageCTA>
    </UCarousel>
  </UPageSection>
</template>
