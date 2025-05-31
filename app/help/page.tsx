"use client"

import type * as React from "react"
import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Search, Play, Clock, Users, FileCheck, Shield, Building, Settings } from "lucide-react"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import { VideoPopup } from "@/components/video-popup"
import { useState, useEffect } from "react"

interface VideoCard {
  id: string
  title: string
  description: string
  duration: string
  category: string
  videoUrl: string
  thumbnail: string
  icon: React.ComponentType<{ className?: string }>
}

const videoData: VideoCard[] = [
  {
    id: "creating-staff-types",
    title: "Creating Staff Types",
    description: "Learn how to create and configure different staff types in your HeyEd system.",
    duration: "2:30",
    category: "Getting Started",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Creating%20staff%20types-T8WDmsmQsSUknZ9PD3axdFIb3VRkGD.mp4",
    thumbnail: "/thumbnails/creating-staff-types-new.png",
    icon: Users,
  },
  {
    id: "getting-started",
    title: "Getting Started with HeyEd",
    description: "Learn the basics of setting up your account and navigating the platform for the first time.",
    duration: "3:45",
    category: "Getting Started",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=getting started tutorial",
    icon: Play,
  },
  {
    id: "staff-management",
    title: "Managing Staff Records",
    description: "Complete guide to adding, editing, and organizing staff profiles and documentation.",
    duration: "5:20",
    category: "Staff Management",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=staff management dashboard",
    icon: Users,
  },
  {
    id: "document-upload",
    title: "Document Upload & Verification",
    description: "How to securely upload and manage staff documents with automated verification.",
    duration: "4:15",
    category: "Documents",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=document upload interface",
    icon: FileCheck,
  },
  {
    id: "compliance-tracking",
    title: "Compliance Tracking & Alerts",
    description: "Set up automated compliance tracking and receive alerts for expiring documents.",
    duration: "6:30",
    category: "Compliance",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=compliance dashboard alerts",
    icon: Shield,
  },
  {
    id: "multi-venue",
    title: "Multi-Venue Management",
    description: "Learn how to manage staff compliance across multiple venues and locations.",
    duration: "4:45",
    category: "Multi-Venue",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=multi venue dashboard",
    icon: Building,
  },
  {
    id: "account-settings",
    title: "Account Settings & Permissions",
    description: "Configure user permissions, account settings, and team access controls.",
    duration: "3:20",
    category: "Settings",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg?height=200&width=350&query=account settings interface",
    icon: Settings,
  },
]

const categories = ["All", "Getting Started", "Staff Management", "Documents", "Compliance", "Multi-Venue", "Settings"]

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVideo, setSelectedVideo] = useState<VideoCard | null>(null)

  // Add meta tags to prevent search engine indexing
  useEffect(() => {
    const metaRobots = document.createElement("meta")
    metaRobots.name = "robots"
    metaRobots.content = "noindex, nofollow"
    document.head.appendChild(metaRobots)

    const metaGooglebot = document.createElement("meta")
    metaGooglebot.name = "googlebot"
    metaGooglebot.content = "noindex, nofollow"
    document.head.appendChild(metaGooglebot)

    return () => {
      document.head.removeChild(metaRobots)
      document.head.removeChild(metaGooglebot)
    }
  }, [])

  const filteredVideos = videoData.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleVideoPlay = (video: VideoCard) => {
    setSelectedVideo(video)
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex-1 relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/gradient.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container className="py-8 md:py-12 relative z-10">
          <div className="space-y-8">
            <div className="space-y-6">
              <Button variant="ghost" asChild className="-ml-4">
                <Link href="https://app-stag.heyed.co.uk/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to App
                </Link>
              </Button>

              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold mb-4">Help Centre</h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  Learn how to get the most out of HeyEd with our comprehensive video tutorials and guides.
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full ${
                    selectedCategory === category ? "bg-teal-500 hover:bg-teal-600" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="text-center text-gray-500">
              {filteredVideos.length} tutorial{filteredVideos.length !== 1 ? "s" : ""} found
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div className="relative w-full h-full cursor-pointer" onClick={() => handleVideoPlay(video)}>
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                          <Play className="h-6 w-6 text-teal-500 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-teal-100">
                        <video.icon className="h-4 w-4 text-teal-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">{video.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tutorials found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search terms or selecting a different category.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />

      {selectedVideo && (
        <VideoPopup
          isOpen={!!selectedVideo}
          onClose={handleCloseVideo}
          videoUrl={selectedVideo.videoUrl}
          title={selectedVideo.title}
        />
      )}
    </div>
  )
}
