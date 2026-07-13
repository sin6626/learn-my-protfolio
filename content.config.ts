/**
 * Nuxt Content 内容集合定义
 * - 通过 defineCollection + zod schema 定义各类内容的结构与校验规则
 * - 通过 .editor({ input: 'media' }) 等装饰器指定 Nuxt Studio 编辑器输入类型
 * - 共定义 6 个集合: index / projects / blog / pages / speaking / about
 */

import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/**
 * 创建基础 schema: 标题 + 描述
 * - 多个集合会复用此基础结构
 */
const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

/**
 * 创建按钮 schema
 * - 用于内容中需要渲染 UButton 的场景 (Hero CTA、页脚链接等)
 * - 大部分字段为可选,容错性高
 */
const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

/**
 * 创建图片 schema
 * - src 在 Nuxt Studio 中通过媒体库选择
 */
const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

/**
 * 创建作者 schema
 * - 用于博客文章作者/推荐语作者
 * - 包含头像与各社交平台字段 (均为可选)
 */
const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

/**
 * 创建推荐语 schema
 * - quote: 推荐语正文
 * - author: 推荐人信息 (复用 author schema)
 */
const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

export default defineContentConfig({
  collections: {
    // 首页内容集合 (单文件 index.yml)
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        // Hero 区: CTA 按钮组 + 跑马灯图片组
        hero: z.object({
          links: z.array(createButtonSchema()),
          images: z.array(createImageSchema())
        }),
        // About 区: 标题 + 描述
        about: createBaseSchema(),
        // 工作经历区: 标题/描述 + 多个工作项 (含公司信息)
        experience: createBaseSchema().extend({
          items: z.array(z.object({
            date: z.date(),
            position: z.string(),
            company: z.object({
              name: z.string(),
              url: z.string(),
              logo: z.string().editor({ input: 'icon' }),
              color: z.string()
            })
          }))
        }),
        // 推荐语数组
        testimonials: z.array(createTestimonialSchema()),
        // 博客区: 标题 + 描述
        blog: createBaseSchema(),
        // FAQ 区: 标题/描述 + 多个分类 (每个分类含多个问答)
        faq: createBaseSchema().extend({
          categories: z.array(
            z.object({
              title: z.string().nonempty(),
              questions: z.array(
                z.object({
                  label: z.string().nonempty(),
                  content: z.string().nonempty()
                })
              )
            }))
        })
      })
    }),
    // 项目集合 (多文件 projects/*.yml)
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().nonempty().editor({ input: 'media' }),
        url: z.string().nonempty(),
        tags: z.array(z.string()),
        date: z.date()
      })
    }),
    // 博客文章集合 (多文件 blog/*.md,frontmatter 中包含以下字段)
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }),
        author: createAuthorSchema()
      })
    }),
    // 通用页面集合 (用于 projects / blog 列表页等)
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema())
      })
    }),
    // 演讲活动集合 (单文件 speaking.yml)
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
        links: z.array(createButtonSchema()),
        events: z.array(z.object({
          category: z.enum(['Live talk', 'Podcast', 'Conference']),
          title: z.string(),
          date: z.date(),
          location: z.string(),
          url: z.string().optional()
        }))
      })
    }),
    // 关于页集合 (单文件 about.yml)
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        // content 为 MDC 渲染内容 (无强类型约束)
        content: z.object({}),
        // 拍立得风格图片集
        images: z.array(createImageSchema())
      })
    })
  }
})
