/**
 * 首页工作经历区 (Work Experience)
 * - 由 index.yml 的 experience 字段驱动
 * - 时间线形式展示每段经历: 日期 + 职位 + 公司链接 (带公司色与 logo)
 * - 使用 Motion 实现进入视口时上移渐显,按索引错开延迟
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// 接收首页数据 (含 experience.items 数组)
defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <!-- 通过 description 槽自定义时间线展示 -->
    <template #description>
      <div class="flex flex-col gap-2">
        <!-- 每段工作经历 (按 index 错开渐入上移动画) -->
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex items-center text-nowrap gap-2"
        >
          <!-- 日期 -->
          <p class="text-sm">
            {{ experience.date }}
          </p>
          <!-- 日期与公司间分隔线 -->
          <USeparator />
          <!-- 公司链接 (新窗口打开,公司色 + logo) -->
          <ULink
            class="flex items-center gap-1"
            :to="experience.company.url"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience.position }}
            </span>
            <div
              class="inline-flex items-center gap-1"
              :style="{ color: experience.company.color }"
            >
              <span class="font-medium">{{ experience.company.name }}</span>
              <UIcon :name="experience.company.logo" />
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
