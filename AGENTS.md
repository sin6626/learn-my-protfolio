# 项目说明

这是一个使用 Nuxt 4 + Nuxt UI 4 构建的个人作品集模板项目。基于 Nuxt 官方的 portfolio 模板。

## 技术栈

- **框架**: Nuxt 4 (Vue 3 + TypeScript)
- **UI 库**: Nuxt UI 4 (包含 UApp、UPage、UButton 等以 `U` 开头的组件)
- **内容**: Nuxt Content 3 (Markdown / YAML 驱动的内容管理)
- **样式**: Tailwind CSS 4
- **图标**: Iconify (`@iconify-json/lucide`, `@iconify-json/simple-icons`)
- **图片**: Nuxt Image
- **动效**: motion-v (Motion for Vue)
- **OG 图**: nuxt-og-image
- **工具库**: VueUse

## 目录结构

```
app/
  app.vue               # 根组件,挂载 UApp、布局、内容搜索
  app.config.ts         # Nuxt UI 应用配置 (主题色、页脚链接等)
  error.vue             # 404/错误页面
  assets/css/main.css   # 全局样式入口
  layouts/default.vue   # 默认布局 (顶部导航 + 内容 + 页脚)
  pages/                # 路由页面
    index.vue           # 首页 (Hero / About / Experience / Blog / Testimonials / FAQ)
    about.vue           # 关于页
    projects.vue        # 项目列表页
    speaking.vue        # 演讲活动页
    blog/index.vue      # 博客列表页
    blog/[...slug].vue  # 博客详情页 (动态路由)
  components/
    AppHeader.vue       # 顶部浮动导航
    AppFooter.vue       # 页脚
    ColorModeButton.vue # 暗色/亮色切换按钮 (使用 View Transitions API)
    PolaroidItem.vue    # 拍立得风格图片
    landing/            # 首页分区组件
      Hero.vue          # 主视觉区
      About.vue         # 简介
      Blog.vue          # 博客精选
      FAQ.vue           # 常见问题
      Testimonials.vue  # 推荐语轮播
      WorkExperience.vue# 工作经历
    OgImage/Portfolio.takumi.vue  # OG 分享图模板组件
  utils/
    links.ts            # 顶部导航菜单项
    clipboard.ts        # 复制到剪贴板 + Toast 提示
content/                # Nuxt Content 的 Markdown / YAML 内容
content.config.ts       # Nuxt Content 集合 schema 定义
nuxt.config.ts          # Nuxt 配置 (模块、内容、预渲染、ESLint、OG 图)
eslint.config.mjs       # ESLint 配置 (基于 Nuxt 默认)
tsconfig.json           # TypeScript 配置 (引用 .nuxt 生成文件)
package.json            # 依赖与脚本
```

## 命令

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览生产构建
pnpm lint         # ESLint 校验
pnpm lint:fix     # ESLint 自动修复
pnpm typecheck    # 类型检查 (vue-tsc)
```

## 组件命名约定

- `U` 开头组件 = **Nuxt UI 内置组件** (如 `UApp`、`UButton`、`UPageHero`)
- `Lazy` 前缀 = Nuxt 自动懒加载版本 (如 `LazyUContentSearch`)
- 其他组件 = **项目自定义组件** (如 `AppHeader`、`LandingHero`)
- Nuxt 自动按目录路径注册组件前缀,如 `landing/Hero.vue` → `LandingHero`,`OgImage/Portfolio.takumi.vue` → `OgImagePortfolioTakumi` (用于 OG 图渲染)

## 内容集合

在 `content.config.ts` 中定义:

- `index`: 首页内容 (来自 `index.yml`)
- `projects`: 项目数据 (来自 `projects/*.yml`)
- `blog`: 博客文章 (来自 `blog/*.md`)
- `pages`: 通用页面 (`projects.yml`、`blog.yml`)
- `speaking`: 演讲活动 (`speaking.yml`)
- `about`: 关于页 (`about.yml`)

## 主题

- 主色: `blue`
- 中性色: `neutral`
- 支持暗色/亮色模式 (通过 `useColorMode()` 控制)
- 全局变量在 `app.config.ts` 的 `global` 字段 (头像、邮箱、是否可接单等)

## 注释规则

项目代码使用中文完整注释:
- 每个文件顶部有文件说明
- 重要函数 / 计算属性 / 组件逻辑有行内注释
- Vue 组件的 `<script setup>`、`<template>`、`<style>` 各块内独立注释

## 工作流约定 (来自全局 AGENTS.md)

- 使用 Conventional Commits,提交信息使用中文
- 禁止批量删除文件,需删除时一次删一个明确路径
- 临时文件不放在 C 盘,放在项目目录下
- GitHub 操作使用本地的 `gh` CLI
