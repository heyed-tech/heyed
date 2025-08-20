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
      generator: 'v0.dev'
    };
