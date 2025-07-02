import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Timo Möbes - AI Developer & Software Engineer',
    template: '%s | Timo Möbes Portfolio'
  },
  description: 'Timo Möbes - AI Developer, Software Engineer, and Healthcare Technology Specialist. Explore my portfolio showcasing AI research agents, IoT projects, and modern web applications.',
  keywords: ['Timo Möbes', 'AI Developer', 'Software Engineer', 'Healthcare Technology', 'Portfolio', 'Next.js', 'TypeScript', 'AI Research', 'IoT', 'Web Development'],
  authors: [{ name: 'Timo Möbes' }],
  creator: 'Timo Möbes',
  publisher: 'Timo Möbes',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Timo Möbes - AI Developer & Software Engineer',
    description: 'AI Developer, Software Engineer, and Healthcare Technology Specialist. Explore my portfolio showcasing AI research agents, IoT projects, and modern web applications.',
    siteName: 'Timo Möbes Portfolio',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Timo Möbes Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timo Möbes - AI Developer & Software Engineer',
    description: 'AI Developer, Software Engineer, and Healthcare Technology Specialist.',
    images: ['/og-default.jpg'],
    creator: '@your_twitter_handle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
