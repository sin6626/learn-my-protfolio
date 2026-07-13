/**
 * 首页 FAQ 常见问题区
 * - 由 index.yml 的 faq 字段驱动 (含 categories,内部再有 questions)
 * - 上层 UTabs 按分类切换,层内 UAccordion 折叠问答
 * - 自定义 UTabs 与 UAccordion 的 UI 样式 (背景、触发器、尾图标旋转等)
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

// 将首页 FAQ 配置中的 categories 转换为 UTabs 所需的 items 格式
const items = computed(() => {
  return props.page.faq?.categories.map((faq) => {
    return {
      label: faq.title,
      key: faq.title.toLowerCase(),
      questions: faq.questions
    }
  })
})

// UTabs 的自定义 UI 样式覆盖 (列表、指示器、触发器、标签)
const ui = {
  root: 'flex items-center gap-4 w-full',
  list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0',
  indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
  trigger: 'px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
  label: 'truncate'
}
</script>

<template>
  <UPageSection
    :title="page.faq.title"
    :description="page.faq.description"
    :ui="{
      container: 'px-0 pt-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <!-- 顶部 Tab 切换分类 -->
    <UTabs
      :items
      orientation="horizontal"
      :ui
    >
      <!-- 每个 Tab 内的内容: 折叠面板展示该分类下的问题 -->
      <template #content="{ item }">
        <UAccordion
          trailing-icon="lucide:plus"
          :items="item.questions"
          :unmount-on-hide="false"
          :ui="{
            item: 'border-none',
            trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
            trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted'
          }"
        >
          <!-- 折叠展开后的内容: MDC 渲染,去掉顶层 p 包裹 -->
          <template #body="{ item: _item }">
            <MDC
              :value="_item.content"
              unwrap="p"
              class="px-4"
            />
          </template>
        </UAccordion>
      </template>
    </UTabs>
  </UPageSection>
</template>
