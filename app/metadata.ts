import type { Metadata } from "next"

const siteConfig = {
  name: "HeyEd",
  description:
    "Staff management and compliance software for education providers. Streamline your Ofsted compliance, staff records, and HR processes.",
  url: "https://heyed.co.uk",
  images: {
    default: {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hey-gIqoFSW8trhDYPD5yHQTr9PEyNKnFQ.png",
      width: 1200,
      height: 630,
      alt: "HeyEd - Staff management made effortless",
    },
  },
}

// Add structured data configuration
const structuredData = {
  application: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HeyEd",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "22.00",
      priceCurrency: "GBP",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "3",
    },
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does HeyEd help with Ofsted compliance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HeyEd automatically tracks and manages all necessary documentation, certifications, and training records required for Ofsted compliance. Our system provides real-time alerts for expiring documents and maintains a complete audit trail, ensuring you're always inspection-ready.",
        },
      },
      {
        "@type": "Question",
        name: "Can I import existing staff records?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! HeyEd provides a simple import tool that allows you to bulk upload your existing staff records. We support various file formats including CSV and Excel, and our team can assist with the migration process.",
        },
      },
      {
        "@type": "Question",
        name: "What security measures are in place?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We take security seriously. HeyEd uses bank-level encryption for all data, maintains regular backups, and complies with GDPR requirements. All data is stored in secure UK-based data centers, and we implement strict access controls and authentication measures.",
        },
      },
    ],
  },
}

export const sharedMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "staff management",
    "education compliance",
    "Ofsted compliance",
    "school management",
    "HR software",
    "education HR",
    "staff records",
    "compliance tracking",
  ],
  authors: [{ name: "HeyEd" }],
  creator: "HeyEd",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.images.default],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.images.default],
    creator: "@oh_hey_ed",
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
  verification: {
    google: "your-google-verification-code",
  },
  structuredData: structuredData,
}

export const metadata = sharedMetadata
