import type { Metadata } from "next"
import VideoPageContent from "@/components/video-page-content"

export const metadata: Metadata = {
  title: "HeyEd Demo Video | See Our Nursery Management Software in Action",
  description: "Watch HeyEd in action and discover how our UK nursery management software transforms staff compliance, document management, and operational efficiency.",
  keywords: "HeyEd demo, nursery management software demo, UK childcare software, staff management demo, compliance tracking video",
  openGraph: {
    title: "HeyEd Demo Video - See Our Software in Action",
    description: "Watch how HeyEd transforms nursery operations with automated compliance tracking, staff management, and document handling for UK childcare providers.",
    url: "https://heyed.co.uk/video",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyEd Demo Video",
    description: "See how HeyEd streamlines nursery management and compliance for UK childcare providers.",
  },
}

export default function VideoPage() {
  return <VideoPageContent />
}