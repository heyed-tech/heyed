import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AskEd. | Instant Compliance Guidance for Nurseries & Clubs',
  description: 'Get instant answers to KCSiE, EYFS, and Ofsted compliance questions. AskEd. provides AI-powered guidance based on official publications for nurseries and clubs.',
  keywords: 'KCSiE 2025, EYFS framework, Ofsted compliance, nursery compliance, childcare regulations, safeguarding guidance, designated safeguarding lead, early years compliance',
  authors: [{ name: 'HeyEd.' }],
  robots: 'index, follow',
  openGraph: {
    title: 'AskEd. | Instant Compliance Guidance for Nurseries & Clubs',
    description: 'AI-powered compliance assistant providing instant answers about KCSiE, EYFS, and Ofsted requirements',
    url: 'https://heyed.co.uk/ask-ed',
    type: 'website',
    siteName: 'HeyEd.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hey-gIqoFSW8trhDYPD5yHQTr9PEyNKnFQ.png',
        width: 1200,
        height: 630,
        alt: 'AskEd. | Instant Compliance Guidance for Nurseries & Clubs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AskEd. | Instant Compliance Guidance for Nurseries & Clubs',
    description: 'Get instant answers to your KCSiE, EYFS, and Ofsted compliance questions',
    creator: '@oh_hey_ed',
  },
}

export default function AskEdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}