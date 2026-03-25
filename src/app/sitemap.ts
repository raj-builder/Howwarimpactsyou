import type { MetadataRoute } from 'next'
import { WAR_LIST } from '@/data/wars'
import { CATEGORIES } from '@/data/categories'
import { ARTICLE_SLUGS } from '@/content/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://howwarimpactsyou.com'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/simulator`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/basket`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/methodology`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/validation`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/data-sources`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/changelog`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/learn`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/data`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/compare`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/saved`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/press`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/embed/impact-card`, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/embed/basket`, changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  // 50 scenario landing pages (5 wars x 10 categories)
  const scenarioPages = WAR_LIST.flatMap((war) =>
    CATEGORIES.map((cat) => ({
      url: `${baseUrl}/impact/${war.id}/${cat.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  // 5 learning hub article pages
  const learnPages = ARTICLE_SLUGS.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...scenarioPages, ...learnPages].map((page) => ({
    ...page,
    lastModified: now,
  }))
}
