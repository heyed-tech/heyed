import type React from "react"
import { Inter, Bitter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css" // Keep this import for Tailwind styles
import "./styles/slider.css"
import ErrorBoundary from "@/components/error-boundary"
import Script from "next/script"

const bitter = Bitter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-bitter",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="./apple-touch-icon.png" />

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
  title: 'HeyEd. - UK Nursery & Club Management Software',
  description: 'Streamline your UK nursery or club operations with HeyEd. Complete compliance management, staff tracking, and business tools designed for EYFS, KCSiE, and Ofsted requirements.',
  keywords: 'nursery management, club management, EYFS compliance, KCSiE, Ofsted, UK childcare software',
  authors: [{ name: 'HeyEd.' }],
  creator: 'HeyEd.',
  publisher: 'HeyEd.',
  metadataBase: new URL('https://heyed.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HeyEd. - UK Nursery & Club Management Software',
    description: 'Streamline your UK nursery or club operations with HeyEd. Complete compliance management, staff tracking, and business tools designed for EYFS, KCSiE, and Ofsted requirements.',
    url: 'https://heyed.co.uk',
    siteName: 'HeyEd.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hey-gIqoFSW8trhDYPD5yHQTr9PEyNKnFQ.png',
        width: 1200,
        height: 630,
        alt: 'HeyEd. - UK Nursery & Club Management Software',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeyEd. - UK Nursery & Club Management Software',
    description: 'Streamline your UK nursery or club operations with HeyEd. Complete compliance management, staff tracking, and business tools designed for EYFS, KCSiE, and Ofsted requirements.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hey-gIqoFSW8trhDYPD5yHQTr9PEyNKnFQ.png'],
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
