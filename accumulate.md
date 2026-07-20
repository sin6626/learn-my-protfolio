# Tailwind / Nuxt UI 经典套路速查

> 本项目开发过程中累积的高频、可直接复用的样式搭配速查表。
> 涵盖定位、毛玻璃浮岛、Tailwind 4 新语法、Nuxt UI 主题色别名、动效联动等。

---

## 一、定位 / 居中三件套

### 任意宽度元素的绝对居中(最经典)

```html
<div class="fixed left-1/2 -translate-x-1/2">
  ...
</div>
```

- `left-1/2`:把元素**左上角点**放到屏幕水平中线
- `-translate-x-1/2`:再回拉**自身宽度的一半**,实现真正的几何居中
- 不依赖具体 px,任意宽度都居中,比 `margin-left: -w/2` 优雅

### 顶部悬浮岛(常用于导航 / FAB)

```html
<div class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-10">
  ...
</div>
```

参考本项目的 `app/components/AppHeader.vue`。

---

## 二、毛玻璃浮岛(macOS 风)

```html
<div class="
  bg-muted/80
  backdrop-blur-sm
  rounded-full
  border border-muted/50
  shadow-lg shadow-neutral-950/5
">
  ...
</div>
```

拆解:

| Class | 含义 |
|---|---|
| `bg-muted/80` | Nuxt UI 主题色 `muted` 80% 透明,做模糊基底 |
| `backdrop-blur-sm` | 模糊背后内容,核心的「毛玻璃」质感 |
| `rounded-full` | 胶囊化(两端半圆) |
| `border border-muted/50` | 同色更淡的描边,做精细分层 |
| `shadow-lg shadow-neutral-950/5` | Tailwind 4 拆分写法,大小 + 颜色独立,亮色场景的**淡阴影**不突兀 |

> 适用:任何浮层、popover、浮动按钮、顶部导航胶囊。

---

## 三、Tailwind 4 新语法(高频三招)

### 1️⃣ 任意 CSS 变量值

```html
<div class="max-w-(--ui-container)">
```

等价于 `max-width: var(--ui-container)`,括号内可放任意 CSS variable,替代旧版 `max-w-[1400px]` 死值。

### 2️⃣ data-attr 状态选择器

```html
<!-- 本元素状态 -->
<button class="data-[state=active]:text-highlighted data-[state=inactive]:text-muted">

<!-- 父级挂 group 时,子元素响应父级 data-state -->
<div class="group">
  <Icon class="group-data-[state=open]:rotate-135" />
</div>
```

配合 Reka UI / Nuxt UI 的 `data-state` 自动 toggle,**纯 CSS 响应组件状态**,不写 JS 切 class。

### 3️⃣ important 后缀

```html
<div class="pt-0! px-0!">
```

Tailwind 4 把 `!` 移到末尾(旧版是 `!pt-0`)。**压第三方库默认样式必备**——比如压过 Nuxt UI 组件自带的 padding/ring。

---

## 四、响应式出血 + 兼容器锁宽

「让某区块出血到全宽,但又被 UI 容器限宽」的经典组合:

```html
<div class="-mx-4 sm:-mx-12 lg:-mx-16 max-w-(--ui-container)">
```

| Class | 含义 |
|---|---|
| `-mx-4 sm:-mx-12 lg:-mx-16` | 负边距让区块**反向吃掉父级 padding**,出血到内容边 |
| `max-w-(--ui-container)` | 但又被 Nuxt UI 容器宽度锁住,不会越界 |

参考本项目 `app/components/landing/Testimonials.vue` 的 `UCarousel` viewport 配置。

---

## 五、`before:` / `after:` 伪元素装饰

### 父 hover 子才显 + 滑一下(三件套)

```html
<div class="group">
  <UIcon class="
    opacity-0
    group-hover:opacity-100
    group-hover:translate-x-1
    transition-all
  " />
</div>
```

- 父级挂 `group`
- 子元素常驻隐藏(`opacity-0`)
- `group-hover:*`:父级 hover 时子才响应
- 配 `transition-all` 做丝滑过渡

参考本项目 `app/components/landing/Blog.vue` 的 "Read Article" 箭头按钮。

> 适用:hover 时才渐显的图标、徽章、箭头、装饰元素。

### 大引号装饰

```html
<p class="
  before:content-[open-quote]
  before:text-7xl
  before:text-dimmed
  before:absolute
  before:-ml-10
  before:-mt-4
  after:content-[close-quote]
  after:...对称
">
  推荐语正文...
</p>
```

关键点:`content-[open-quote]` 是 Tailwind 4 任意值语法,编译成 `content: open-quote`,引号自动按文档 `lang` 渲染(英文 `"` / 中文 `「」`)。

参考本项目 `app/components/landing/Testimonials.vue` 的 `UPageCTA`。

---

## 六、Nuxt UI 主题色别名(Semantic Colors)

这些 class 在 Tailwind 官网搜不到,但**项目里到处都是**。[查看 Nuxt UI 主题文档](https://ui.nuxt.com/docs/theme)。

### 颜色别名

| 别名 | 含义 |
|---|---|
| `bg-default` | 默认页面背景 |
| `bg-muted` | 次要表面色(卡片淡底) |
| **`bg-elevated`** | 凸起表面(卡片 / 浮层 / 选中态),比 `muted` 稍亮 |
| `bg-accented` | 进一步加 accent |
| `bg-highlighted` | 高亮选中 |
| `bg-inverted` | 反色背景 |
| `text-default` | 主文本色 |
| **`text-muted`** | 次要文字 |
| **`text-dimmed`** | 极次文字(装饰元素、图标描边常驻) |
| `text-hi` | 强调文字 |
| `text-inverted` | 反色文字 |

### 高频组合

#### 半透卡片底
```html
<div class="bg-elevated/60">...</div>
```
60% 透明的凸起色,做卡片「轻微浮起」感。

#### hover 轻微反馈
```html
<div class="hover:bg-muted/50">...</div>
```
鼠标进入变次要色 50% 透明,轻微 hover 反馈,不抢眼。

#### 激活态文字色切换(Nuxt UI 标配!)
```html
<button class="
  data-[state=active]:text-highlighted
  data-[state=inactive]:text-muted
">
  ...
</button>
```
Reka UI 状态切换时自动 toggle `data-state`,纯 CSS 被动响应。

参考本项目 `app/components/landing/FAQ.vue` 的 `UTabs` 样式覆盖。

---

## 七、`group` + `group-hover:` 联动机制

**父级挂 `group`,子用 `group-hover:*` 响应父级 hover**——Tailwind 不写 JS 切 class 的核心模式。

```html
<div class="group">
  <!-- 子元素常驻不可见,鼠标 hover 到父级任意位置时才显 -->
  <Icon class="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
</div>
```

要点:
- 子元素自己常驻隐藏(`opacity-0`),鼠标根本 hover 不到它
- 鼠标 hover 父级任意位置 → 子响应
- 配合 `group-data-[state=open]:*` 还能响应父级特定 data-state

> 网页动效 80% 的 hover 联动都靠它,React / Vue 项目通用。

---

## 八、动画性能套件

折叠 / 抽屉 / Tab 切换等动画场景,给做 transform 的元素加这两个,防掉帧:

```html
<div class="transform-gpu will-change-transform">
  ...
</div>
```

| Class | 含义 |
|---|---|
| `transform-gpu` | 强制该元素用 GPU 合成层渲染 |
| `will-change-transform` | CSS hint,提前告诉浏览器「这元素的 transform 即将变化」,提前优化 |

参考本项目 `app/components/landing/FAQ.vue` 的 `UAccordion` trigger 样式。

---

## 九、其他常用速记

| 场景 | Class 串 |
|---|---|
| 长文字省略号 | `truncate` (= `overflow:hidden; text-overflow:ellipsis; white-space:nowrap`) |
| 短文本行宽平衡 | `text-balance`(浏览器自动平衡每行长度,推荐语尾部不会只剩 1-2 字) |
| 防止意外换行 | `text-nowrap` |
| 紧凑卡片悬停反馈 | `hover:bg-muted/50` + `rounded-lg` + `px-3 py-2` |

---

## 完整 Cheatsheet

| 场景 | 关键 class 串 |
|---|---|
| 顶部悬浮居中浮岛 | `fixed top-X left-1/2 -translate-x-1/2 z-10` |
| 毛玻璃胶囊 | `bg-muted/80 backdrop-blur-sm rounded-full border border-muted/50 shadow-lg shadow-neutral-950/5` |
| 父 hover 子才显 + 滑一下 | `opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`(父挂 `group`) |
| 压过第三方默认样式 | `pt-0!` / `px-0!`(Tailwind 4 important 后缀) |
| Reka UI 状态切文字色 | `data-[state=active]:text-highlighted data-[state=inactive]:text-muted` |
| 子元素响应父级 data-state | `group-data-[state=open]:rotate-135`(父挂 `group`) |
| 出血到全宽 + 锁 UI 容器宽 | `-mx-4 sm:-mx-12 lg:-mx-16 max-w-(--ui-container)` |
| 装饰性 CSS 大引号 | `before:content-[open-quote] before:text-7xl before:absolute before:-ml-10` |
| 动画不卡 GPU 提升 | `transform-gpu will-change-transform` |
| 简单大字 + 平衡行宽 | `text-balance` |
| 防换行 | `text-nowrap` |
| 长文字省略号 | `truncate` |
| 半透卡片底 | `bg-elevated/60` |
| hover 轻微反馈 | `hover:bg-muted/50` |

---

## 常见疑问

**Q: 为什么 `bg-elevated` / `text-muted` 等在 Tailwind 官网搜不到?**

A: 这些是 **Nuxt UI 自己注入的语义化颜色别名**(Semantic Colors),基于 CSS 变量,自动跟随 light/dark 模式切换。要在 [Nuxt UI 主题文档](https://ui.nuxt.com/docs/theme) 的 Semantic Colors 章节查,不是 Tailwind 原生类。

**Q: `!` 后缀是什么?**

A: Tailwind 4 的 important 语法,放在 class 末尾(如 `pt-0!`),等价于 `padding-top: 0 !important`,主要用来压过第三方库的默认样式。

**Q: `group` 和 `group-hover:` 必须配套吗?**

A: 是的。`group` 标在父级,`group-hover:*` 才能在父级 hover 时生效。单独写 `group-hover:*` 而父级没 `group`,Tailwind 不会识别父级关系,会失效。

**Q: `rem` 是什么单位?**

A: 相对于 `<html>` 根元素 `font-size`(默认浏览器 16px)。Tailwind 的 spacing 系列(`p-1` `gap-8` `text-xl` 等)全部基于 rem,默认 `1rem = 16px`,改 `<html>` 的 font-size 可全局等比缩放。

---

> 后续遇到新的经典套路继续追加到本文档。
