/**
 * 暗色 / 亮色颜色模式切换按钮
 * - 使用 View Transitions API 实现从点击点扩散的圆形切换动画
 * - 不支持 startViewTransition 时降级为直接切换
 * - 仅在客户端渲染 (ClientOnly 包装)
 */

<script setup lang="ts">
// 获取当前颜色模式实例
const colorMode = useColorMode()

// 计算下一个主题 (当前为暗则切到亮,反之亦然)
const nextTheme = computed(() => (colorMode.value === 'dark' ? 'light' : 'dark'))

// 实际切换颜色模式: 设置 preference 触发切换
const switchTheme = () => {
  // 设置用户的偏好属性, 也就是切换主题
  colorMode.preference = nextTheme.value
}

// 通过 View Transitions API 启动从点击点扩散的圆形过渡动画
const startViewTransition = (event: MouseEvent) => {
  // 浏览器不支持时直接切换
  // 浏览器的新的api, 帮助网页实现页面状态变化动画。
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  // 点击点坐标与扩散半径 (覆盖全屏)
  const x = event.clientX // 浏览器点击位置距离左侧的距离
  const y = event.clientY // 浏览器点击位置距离浏览器顶部的距离
  // 下面代码的本质就是计算这个动画圆的最大的半径
  // 当点击了一点屏幕上的点之后, 要计算这个圆的最大的半径, 让动画覆盖全屏幕, 也就是说, 要对比这个点距离屏幕左上, 左下, 右上, 右下距离的最大值, 下面的算法就是做的这一点, 而Math.hypot就是进行勾股定理求取半径 === Math.sprt(a*a + b*b)
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // 启动视图过渡并执行切换
  // 旧页面, 浏览器截图保存, 然后执行startViewTransition里面的方法, 也就是切换到新的主题色页面, 然后截取新页面的截图, 创建好伪元素. 这时候能控制旧页面和新页面之前的过度动画了
  // ::view-transition
  // |
  // |
  // ├── ::view-transition-old(root)
  // |
  // └── ::view-transition-new(root)
  // 上面两个就是浏览器生成的两个图片层, 一个旧页面, 一个新的页面, 上面的是之前的新页面, 下面是旧的页面
  // transition 是个ViewTransition对象是个Promise
  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  // 过渡就绪后用 clipPath 动画实现从点击点扩散的圆形切换效果
  // transition.ready 是个Promise
  // ready方法意思是等浏览器把动画需要的准备好了(就是等transition准备好), 再去执行下面的代码
  transition.ready.then(() => {
    const duration = 600
    // Web Animations API, 类型与css的animation属性, 但是是由JS控制的
    // document.documentElement就是html元素, 给他们加上动画
    // animate前一个参数是动画过程, 后一个参数是动画的配置
    document.documentElement.animate(
      {
        // 见名知意, clip->片段, clipPath意味裁剪, 裁剪的对象是下面配置的新页面的伪元素, circle->圆 第一个参数是圆的半径, 后面的是圆心的坐标
        // 一开始新页面这个圆的半径是0px, 那么就看不到新的页面, 最后是完全包裹屏幕的圆, 也就是把新页面全部展示出来
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: duration,
        // 类似于easy-in-out
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        // pseudo->假, 给新的页面添加过度动画
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
</script>

<template>
  <!-- 仅客户端渲染 (避免水合不匹配) -->
  <!-- useColorMode() 的实际值、document.startViewTransition在服务器端不存在, 只浏览器里面有, 所以使用仅客户端渲染 -->
  <!-- arial-label 是html原生的属性, 是给屏幕阅读器一个可以读的内容, 主要是用来给无障碍使用的 -->
  <ClientOnly>
    <UButton
      :aria-label="`Switch to ${nextTheme} mode`"
      :icon="`i-lucide-${nextTheme === 'dark' ? 'sun' : 'moon'}`"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
      @click="startViewTransition"
    />
    <!-- 加载前占位 -->
    <!-- 就是当ClientOnly还没渲染出来的时候占位置的, 大小跟上面的图标大小一致 -->
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>

<style>
/* 自定义 view-transition 的层叠顺序与混合,避免动画时双图混色 */
::view-transition-old(root),
::view-transition-new(root) {
  /* 浏览器会有默认的动画, 淡入淡出的动画, 这里要关闭 */
  animation: none;
  /* 混合模式, normal就是意味正常显示, 不要叠加, 也就是覆盖 */
  mix-blend-mode: normal;
}

/* 新视图放上层,旧视图放下层 */
::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}
</style>
