import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/auth/',
          '/api/',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}