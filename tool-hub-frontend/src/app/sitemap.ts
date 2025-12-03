import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolhub.com'
  
  const tools = [
    '/dashboard/tools/password-generator',
    '/dashboard/tools/jwt-validator',
    '/dashboard/tools/uuid-generator',
    '/dashboard/tools/base64',
    '/dashboard/tools/hash-generator',
    '/dashboard/tools/data-generator',
    '/dashboard/tools/regex',
    '/dashboard/tools/url-parser',
    '/dashboard/tools/json-jwt',
  ]

  const staticPages = [
    '',
    '/auth',
    '/dashboard',
    '/dashboard/terms',
  ]

  const toolPages = tools.map(tool => ({
    url: `${baseUrl}${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const pages = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.5,
  }))

  return [...pages, ...toolPages]
}
