/**
 * 拍立得风格图片组件
 * - 白底卡片 + 阴影 + 随索引左右微旋转 (-5° / +5°)
 * - hover 时放大、复位、上移并提升层级
 * - 用于 about 页面底部图片展示
 */

<script setup lang="ts">
// 接收图片对象 (src / alt) 与索引 (用于决定旋转方向)
defineProps<{
  image: {
    src: string
    alt: string
  }
  index: number
}>()
</script>

<template>
  <!-- 白色卡片容器: 阴影、过渡动画、根据索引左右旋转 -->
  <!-- 下面的transition-transform表示transition属性只监听transform -->
  <!-- translate-x-4 x轴移动4rem单位 -->
  <div
    class="bg-white p-2 flex flex-col drop-shadow-2xl transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-0 hover:z-10"
    :class="[
      index % 2 === 0 ? '-rotate-5' : 'rotate-5',
      index % 2 === 0 ? 'hover:-translate-x-4' : 'hover:translate-x-4'
    ]"
  >
    <!-- 图片本体 -->
    <img
      :src="image.src"
      :alt="image.alt"
      class="size-32 object-cover"
    >
    <!-- 图片说明 (衬线字体) -->
    <!-- font-serif 衬线字体=> 文艺, 传统, 书籍感 -->
    <span class="w-32 text-xs text-black font-serif font-medium text-center mt-2">
      {{ image.alt }}
    </span>
  </div>
</template>
