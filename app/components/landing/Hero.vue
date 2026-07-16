/**
 * Hero 区 (首页主视觉)
 * - 由 index.yml 中的 hero 字段驱动
 * - 包含: 头像 (按颜色模式切换)、标题、描述、CTA 按钮 + 接单状态、社交链接、跑马灯图片
 * - 使用 Motion 实现多个元素的 staggered 渐入动画 (按 delay 错开)
 */

<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// 接收 footer (社交链接) 与 global (头像/接单状态等) 配置
const { footer, global } = useAppConfig()

// 接收首页数据 (index.yml 解析后的对象)
defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <!-- 下面这种是样式插槽的写法 -->
  <!-- 就是给下面这些区域加上样式, 是unocss的写法 -->
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      // max-w-lg 对应宽度是512px, mx-auto: margin-inline: auto; m后面的x也就是x轴
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <!-- 顶部头像: scale + 模糊渐入 -->
    <template #headline>
      <!-- Motion是组件库Motio-v -->
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <!-- size-18就是同时设定h和w, 1一个数是4px, ring 是用box-shadow绘制一圈外部的描边, ring-default 是给box-shadow的边设计成default这个自定义设计好了的颜色
        ring-offset-3: ring和元素执之间有3px的间隔 -->
        <UColorModeAvatar 
          class="size-18 ring ring-default ring-offset-3 ring-offset-bg "
          :light="global.picture?.light!"
          :dark="global.picture?.dark!"
          :alt="global.picture?.alt!"
        />
      </Motion>
    </template>

    <!-- 标题: 同样的缩放模糊渐入动画 -->
    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ page.title }}
      </Motion>
    </template>

    <!-- 描述: delay 0.3 错开标题 -->
    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <!-- 行动按钮区: 主要 CTA + 接单状态指示 -->
    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex items-center gap-2"
        >
          <!-- 第一个 CTA 按钮 (来自配置文件) -->
          <!-- 这里的v-bind直接把一个对象中的所有属性全部都给组件给绑定上了 -->
          <UButton v-bind="page.hero.links[0]" />
          <!-- 接单状态按钮: 可接单时绿色脉冲,否则红色 -->
          <UButton
            :color="global.available ? 'success' : 'error'"
            variant="ghost"
            class="gap-2"
            :to="global.available ? global.meetingLink : ''"
            :label="global.available ? 'Available for new projects' : 'Not available at the moment'"
          >
            <!-- 前置: 脉冲圆点 (接单时) 或静止红点 -->
             <!-- animate-ping 是Tailwind里面提供的css动画, 一种脉冲动画 -->
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <!-- 社交链接区: 按 index 错开 delay -->
      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"

          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>

    <!-- 跑马灯: 自动滚动展示一组图片 (鼠标悬停可暂停) -->
    <!-- [--duration:40s]的写法就是[]里面直接写原生的css样式, 这里是说动画持续40s -->
    <UMarquee
      pause-on-hover
      class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(img, index) in page.hero.images"
        :key="index"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: index * 0.1
        }"
      >
        <!-- 跑马灯内每个图片: 偶数项向左微旋,奇数项向右微旋 -->
        <!-- 原生的css中aspect-ratio: 宽/高 常用于视频图片的比例, 如如16/9 -->
        <!-- object-cover对应原生的css的object-fit:cover, 表示图片撑满盒子, 然后裁剪掉多余的部分, 多用于展示头像 -->
        <NuxtImg
          width="234"
          height="234"
          class="rounded-lg aspect-square object-cover"
          :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          v-bind="img"
        />
      </Motion>
    </UMarquee>
  </UPageHero>
</template>
