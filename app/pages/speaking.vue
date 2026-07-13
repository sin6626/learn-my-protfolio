/**
 * 演讲活动页 (/speaking)
 * - 由 speaking.yml 内容集合驱动
 * - 自定义 Event 类型,并将事件按 category (Conference / Live talk / Podcast) 分组
 * - 三栏布局: 左栏分类标题 (sticky),右栏事件时间线
 * - 生成自定义 OG 分享图
 */

<script setup lang="ts">
// 演讲事件类型定义 (与 content.config.ts 中的 schema 对应)
type Event = {
  title: string
  date: string
  location: string
  url?: string
  category: 'Conference' | 'Live talk' | 'Podcast'
}

// 从 speaking 集合取首条记录 (speaking.yml)
const { data: page } = await useAsyncData('speaking', () => {
  return queryCollection('speaking').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
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

// 取全局配置 (用于联系邮箱)
const { global } = useAppConfig()

// 将事件按 category 分组为 { Conference, Live talk, Podcast }
const groupedEvents = computed((): Record<Event['category'], Event[]> => {
  const events = page.value?.events || []
  // 初始化三个空数组
  const grouped: Record<Event['category'], Event[]> = {
    'Conference': [],
    'Live talk': [],
    'Podcast': []
  }
  // 遍历事件放入对应分类数组
  for (const event of events) {
    if (grouped[event.category]) grouped[event.category].push(event)
  }
  return grouped
})

// 格式化日期为 "年 月" (英文长月份格式,如 March 2024)
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}
</script>

<template>
  <UPage v-if="page">
    <!-- 标题 + 描述 + 联系按钮 -->
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <UButton
          v-if="page.links"
          :to="`mailto:${global.email}`"
          v-bind="page.links[0]"
        />
      </template>
    </UPageHero>

    <!-- 按分类分组的事件列表 -->
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div
        v-for="(eventsInCategory, category) in groupedEvents"
        :key="category"
        class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 mb-16 last:mb-0"
      >
        <!-- 左栏: 分类标题 (大屏 sticky 固定) -->
        <div class="lg:col-span-1 mb-4 lg:mb-0">
          <h2
            class="lg:sticky lg:top-16 text-xl font-semibold tracking-tight text-highlighted"
          >
            <!-- 在分类名尾部加 s 表示复数 (Live talk → Live talks) -->
            {{ category.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) }}s
          </h2>
        </div>

        <!-- 右栏: 事件时间线 (左侧边框线) -->
        <div class="lg:col-span-2 space-y-8">
          <div
            v-for="(event, index) in eventsInCategory"
            :key="`${category}-${index}`"
            class="group relative pl-6 border-l border-default"
          >
            <!-- 整块可点击跳转 (NuxtLink 占满父级) -->
            <NuxtLink
              v-if="event.url"
              :to="event.url"
              class="absolute inset-0"
            />

            <!-- 地点 + 日期 -->
            <div class="mb-1 text-sm font-medium text-muted">
              <span>{{ event.location }}</span>
              <span
                v-if="event.location && event.date"
                class="mx-1"
              >·</span>
              <span v-if="event.date">{{ formatDate(event.date) }}</span>
            </div>

            <!-- 事件标题 -->
            <h3 class="text-lg font-semibold text-highlighted">
              {{ event.title }}
            </h3>

            <!-- 播客显示 "Listen" / 其他显示 "Watch" -->
            <UButton
              v-if="event.url"
              target="_blank"
              :label="event.category === 'Podcast' ? 'Listen' : 'Watch'"
              variant="link"
              class="p-0 pt-2 gap-0"
            >
              <template #trailing>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                />
              </template>
            </UButton>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
