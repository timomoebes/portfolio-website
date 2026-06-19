import type { Metadata } from "next"
import "./globals.css"

const siteUrl = "https://www.timomoebes.com"
const title = "Timo Möbes - AI Workflow Architect & Agent Builder"
const description = "Timo Möbes builds AI workflow systems, SaaS experiments, and practical automation for consulting, CRM, reporting, lead handling, and operations — combining healthcare technology discipline with AI-assisted product shipping."

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Timo Möbes Portfolio",
  },
  description,
  keywords: [
    "Timo Möbes",
    "AI Workflow Architect",
    "Agent Builder",
    "AI Consulting",
    "OpenClaw Consulting",
    "AI Automation",
    "SaaS Builder",
    "Healthcare Technology",
    "CRM Automation",
    "AI Workflow Implementation",
  ],
  authors: [{ name: "Timo Möbes" }],
  creator: "Timo Möbes",
  publisher: "Timo Möbes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title,
    description,
    siteName: "Timo Möbes Portfolio",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Timo Möbes portfolio - AI workflow architect and agent builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
