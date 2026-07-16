/**
 * 首页 About 区域
 * - 由 index.yml 的 about 字段驱动 (标题 + 描述)
 * - 简单文字段落,左对齐布局
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// 接收首页数据
defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :description="page.about.description"
    :ui="{
      container: 'p-0!',
      //text-left => text-align: left;
      // font-medium 改变的是字体的粗细, 而text-xl改变的是字体的大小
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      // text-muted 是Nuxt UI 里面自带的, 一种温和的小的灰色字体, 不抢夺注意力
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  />
</template>

<style scoped>

</style>
