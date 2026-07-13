/**
 * OG 分享图模板组件 (用于 nuxt-og-image)
 * - 在服务端通过浏览器无头渲染生成静态图,作为社交分享时的预览图
 * - 暗色主题: 左侧主色竖条 + 大标题 + 描述 + Nuxt logo
 * - 文件名 .takumi.vue 表示这是一个 takumi 渲染器兼容的模板 (社区命名约定)
 * - 在页面中通过 defineOgImage('Portfolio', { title, description, headline }) 调用
 */

<script setup lang="ts">
// OG 图作为根节点直接渲染,关闭属性继承避免 attrs 附加到 div
defineOptions({
  inheritAttrs: false
})

// 模板支持的三种可选字段
defineProps<{
  headline?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <!-- OG 图根节点: 暗色背景,固定尺寸 (由 og-image 上下文给定),主题强制 dark -->
  <div
    class="w-full h-full flex bg-neutral-950 relative overflow-hidden"
    data-theme="dark"
  >
    <!-- 左侧主色竖条装饰 -->
    <div class="absolute top-0 left-0 w-1.5 h-full bg-primary-400" />

    <!-- 主体内容: 上下分布,中间留白 -->
    <div class="flex flex-col justify-between flex-1 px-20 py-16">
      <!-- 上部: 占位 -->
      <div />

      <!-- 中部: headline / title / description -->
      <div class="flex flex-col gap-5">
        <span
          v-if="headline"
          class="text-2xl font-medium text-primary-400"
        >
          {{ headline }}
        </span>

        <h1
          v-if="title"
          class="text-6xl font-bold text-highlighted"
        >
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="text-3xl/11 text-muted"
          :style="{ lineClamp: 2, textOverflow: 'ellipsis' }"
        >
          {{ description }}
        </p>
      </div>

      <!-- 底部: Nuxt logo + 分隔线 + 站点名 -->
      <div class="flex items-center gap-4">
        <svg
          class="size-8"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z"
            fill="#00DC82"
          />
        </svg>
        <div class="h-px flex-1 bg-border" />
        <span class="text-xl text-dimmed">ui.nuxt.com</span>
      </div>
    </div>
  </div>
</template>
