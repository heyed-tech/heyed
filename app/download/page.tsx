import type { Metadata } from "next"
import DownloadForm from "@/components/download-form"

export const metadata: Metadata = {
  title: "Free EYFS Safeguarding Changes Guide 2025 | Download PDF | HeyEd",
  description: "Download your free guide to EYFS safeguarding changes for 2025. Essential compliance updates for UK nurseries, early years settings, and childcare providers.",
  keywords: "EYFS 2025, safeguarding changes, early years compliance, nursery safeguarding, childcare regulations, free guide download",
  openGraph: {
    title: "Free EYFS Safeguarding Changes Guide 2025 - Download Now",
    description: "Get your free comprehensive guide to the latest EYFS safeguarding changes affecting UK nurseries and early years settings in 2025.",
    url: "https://heyed.co.uk/download",
  },
  twitter: {
    card: "summary_large_image",
    title: "EYFS Safeguarding Changes 2025 Guide",
    description: "Download the essential guide to EYFS safeguarding updates for UK nurseries and childcare providers.",
  },
}

export default function DownloadPage() {
  return <DownloadForm />
}