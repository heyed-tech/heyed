import type React from "react"
import { Inter, Bitter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css" // Keep this import for Tailwind styles
import "./styles/slider.css"
import ErrorBoundary from "@/components/error-boundary"
import Script from "next/script"

const bitter = Bitter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bitter",
  display: 'swap',
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Primary SVG favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Fallback PNG favicons for older browsers */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple Touch Icon - corrected path */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Android Chrome icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

        <link rel="canonical" href="https://heyed.co.uk" />
      </head>
      <body className={`${bitter.variable} ${inter.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HeyEd.",
              alternateName: ["HeyTech Labs", "Hey Tech Labs"],
              url: "https://heyed.co.uk",
              logo: "https://heyed.co.uk/logo.png",
              sameAs: [
                "https://www.facebook.com/profile.php?id=61568198237207",
                "https://x.com/oh_hey_ed",
                "https://www.linkedin.com/company/heyed",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+44-20-8044-9313",
                contactType: "customer service",
                areaServed: "GB",
                availableLanguage: "English",
              },
            }),
          }}
        />
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
        <Script src="//code.tidio.co/cntps5meqr7es5quouclr4edgpmvykia.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}

export const metadata = {
  title: 'HeyEd. | Compliance Made Simple For Nurseries & Clubs',
  description: 'Turn your Single Central Record into a live compliance system. Automated reminders, DBS tracking, inspection-ready peace of mind.',
  keywords: 'HeyTech Labs, Hey Tech Labs, HeyEd, nursery management, club management, EYFS compliance, KCSiE, Ofsted, UK childcare software, childcare compliance software',
  authors: [{ name: 'HeyEd.' }],
  creator: 'HeyEd.',
  publisher: 'HeyEd.',
  metadataBase: new URL('https://heyed.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HeyEd. | Compliance Made Simple For Nurseries & Clubs',
    description: 'Turn your Single Central Record into a live compliance system with HeyEd. Automated reminders, DBS tracking, and inspection-ready peace of mind.',
    url: 'https://heyed.co.uk',
    siteName: 'HeyEd.',
    images: [
      {
        url: 'https://heyed.co.uk/thumbnails/thumbnail-compressed.jpg',
        width: 1200,
        height: 630,
        alt: 'HeyEd. | Compliance Made Simple For Nurseries & Clubs',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeyEd. | Compliance Made Simple For Nurseries & Clubs',
    description: 'Turn your Single Central Record into a live compliance system. Automated reminders, DBS tracking, inspection-ready peace of mind.',
    images: ['https://heyed.co.uk/thumbnails/thumbnail-compressed.jpg'],
    creator: '@oh_hey_ed',
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
  generator: 'v0.dev'
};
