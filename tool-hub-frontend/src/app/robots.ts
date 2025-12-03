import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/admin/'],
      },
    ],
    sitemap: 'https://toolhub.com/sitemap.xml',
  }
}
