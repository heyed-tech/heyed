import type { Metadata } from "next"
import HelpPageContent from "@/components/help-page-content"

export const metadata: Metadata = {
  title: "Help Centre | HeyEd - Video Tutorials and Support Guides",
  description: "Access comprehensive video tutorials and support guides for HeyEd nursery management software. Learn staff management, compliance tracking, and more.",
  keywords: "HeyEd help, nursery software tutorials, staff management help, compliance tracking guides, UK childcare software support",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "HeyEd Help Centre - Video Tutorials & Guides",
    description: "Comprehensive video tutorials and guides for HeyEd nursery management software. Learn how to maximize your staff management and compliance tracking.",
    url: "https://heyed.co.uk/help",
  },
  twitter: {
    card: "summary",
    title: "HeyEd Help Centre",
    description: "Video tutorials and guides for HeyEd nursery management software.",
  },
}

export default function HelpCenter() {
  return <HelpPageContent />
}
