"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import HeroIllustration from "@/components/hero-illustration"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { CheckCircle2, Shield, Clock, Users, FileCheck, Star, Building } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import PricingCalculator from "@/components/pricing-calculator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Footer } from "@/components/footer"
import { RegisterInterestDialog } from "@/components/register-interest-dialog"
import { CalendlyModal } from "@/components/calendly-modal"

// Screenshot Scroll Section with hijacking effect
function ScreenshotScrollSection() {
  const [isClient, setIsClient] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Image opacity transforms - with extended hold periods for 500vh scroll
  // Mobile gets slightly more time on first image
  const image1EndMobile = 0.30  // was 0.28
  const image2StartMobile = 0.35  // was 0.33
  
  const image1Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.28, 0.33], 
    [0, 1, 1, 0]
  )
  const image1Scale = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.28, 0.33], 
    [0.98, 1, 1, 0.98]
  )
  
  const image2Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.38, 0.43] : [0.28, 0.33, 0.38, 0.43], 
    [0, 1, 1, 0]
  )
  const image2Scale = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.38, 0.43] : [0.28, 0.33, 0.38, 0.43], 
    [0.98, 1, 1, 0.98]
  )
  
  const image3Opacity = useTransform(scrollYProgress, [0.38, 0.43, 0.9, 1], [0, 1, 1, 1])
  const image3Scale = useTransform(scrollYProgress, [0.38, 0.43, 0.9, 1], [0.95, 1, 1, 1])

  // Text opacity transforms matching image transitions
  const text1Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.28, 0.33], 
    [0, 1, 1, 0]
  )
  const text2Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.38, 0.43] : [0.28, 0.33, 0.38, 0.43], 
    [0, 1, 1, 0]
  )
  const text3Opacity = useTransform(scrollYProgress, [0.38, 0.43, 0.9, 1], [0, 1, 1, 1])

  if (!isClient) {
    return null
  }

  return (
    <section ref={sectionRef} className="relative h-[500vh] pt-16 md:pt-20 pb-0 bg-gray-50">
      <div className="sticky top-0 min-h-screen bg-gray-50 flex items-center overflow-hidden" style={{ paddingTop: '32px' }}>
        <Container>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4 max-w-[85rem] mx-auto">
              <div className="inline-block rounded-card bg-teal-100 px-3 py-1 text-sm text-teal-700">Platform Overview</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                Venue Task Management
              </h2>
            </div>
            
            {/* Text section with transitions */}
            <div className="relative h-16 w-full max-w-2xl mx-auto mt-4">
              <motion.p
                style={{
                  opacity: text1Opacity,
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  left: 0
                }}
                className="text-center text-gray-500 md:text-lg xl:text-xl px-4"
              >
                Assign and track tasks across all venues from head office, with real-time compliance visibility in one dashboard.
              </motion.p>
              <motion.p
                style={{
                  opacity: text2Opacity,
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  left: 0
                }}
                className="text-center text-gray-500 md:text-lg xl:text-xl px-4"
              >
                Venue managers receive assigned tasks with deadlines, track progress in real-time, and get automated alerts for overdue items.
              </motion.p>
              <motion.p
                style={{
                  opacity: text3Opacity,
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  left: 0
                }}
                className="text-center text-gray-500 md:text-lg xl:text-xl px-4"
              >
                Monitor completion rates across all venues, identify at-risk locations, and track compliance trends with comprehensive analytics.
              </motion.p>
            </div>

            {/* Images section - with proper height to prevent cutoff */}
            <div className="relative w-full flex items-center justify-center mt-1 min-[400px]:mt-2 sm:mt-4 pb-12 sm:pb-20 min-h-[500px] min-[400px]:min-h-[550px] sm:min-h-[600px]">
              <div className="relative w-full max-w-5xl mx-auto">
                {/* Image 1 - Staff Management */}
                <motion.div
                  style={{
                    opacity: image1Opacity,
                    scale: image1Scale,
                    x: 0,
                    y: 0
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full md:w-[75%] lg:w-[75%] xl:w-[75%] 2xl:w-[70%] max-w-4xl">
                    <div className="absolute -inset-4 bg-gradient-to-br from-teal-400/20 to-blue-400/20 blur-xl opacity-50"></div>
                    <img 
                      src="/images/mobile-staff-management.png" 
                      alt="HeyEd Staff Management" 
                      className="relative w-full h-auto shadow-xl block md:hidden rounded-lg object-contain"
                    />
                    <img 
                      src="/images/Group 1.svg" 
                      alt="HeyEd Staff Management" 
                      className="relative w-full h-auto shadow-xl hidden md:block rounded-lg"
                    />
                  </div>
                </motion.div>

                {/* Image 2 - Compliance Dashboard */}
                <motion.div
                  style={{
                    opacity: image2Opacity,
                    scale: image2Scale,
                    x: 0,
                    y: 0
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full md:w-[75%] lg:w-[75%] xl:w-[75%] 2xl:w-[70%] max-w-4xl">
                    <div className="absolute -inset-4 bg-gradient-to-br from-teal-400/20 to-teal-500/20 blur-xl opacity-50"></div>
                    <img 
                      src="/images/mobile-compliance.png" 
                      alt="HeyEd Compliance Dashboard" 
                      className="relative w-full h-auto shadow-xl block md:hidden rounded-lg object-contain"
                    />
                    <img 
                      src="/images/Group 2.svg" 
                      alt="HeyEd Compliance Dashboard" 
                      className="relative w-full h-auto shadow-xl hidden md:block rounded-lg"
                    />
                  </div>
                </motion.div>

                {/* Image 3 - Document Management */}
                <motion.div
                  style={{
                    opacity: image3Opacity,
                    scale: image3Scale,
                    x: 0,
                    y: 0
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-full md:w-[75%] lg:w-[75%] xl:w-[75%] 2xl:w-[70%] max-w-4xl">
                    <div className="absolute -inset-4 bg-gradient-to-br from-teal-300/20 to-blue-400/20 blur-xl opacity-50"></div>
                    <img 
                      src="/images/mobile-document-management.png" 
                      alt="HeyEd Document Management" 
                      className="relative max-w-[90%] mx-auto h-auto shadow-xl block md:hidden rounded-lg object-contain"
                    />
                    <img 
                      src="/images/Group 3.svg" 
                      alt="HeyEd Document Management" 
                      className="relative w-full h-auto shadow-xl hidden md:block rounded-lg"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

export default function LandingPageClient() {
  // Typewriter effect state
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  
  // Calendly modal state
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  // Words to cycle through
  const words = ["nurseries.", "clubs."]
  const currentWordIndex = loopNum % words.length

  // Reference to store timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Handle typing and deleting logic
    const handleTyping = () => {
      const word = words[currentWordIndex]

      if (!isDeleting) {
        // Typing forward
        setText((prev) => {
          const nextText = word.substring(0, prev.length + 1)

          // If we've completed typing the word
          if (nextText === word) {
            // Pause at the end of typing before starting to delete
            setTypingSpeed(2000) // Longer pause when word is complete
            setIsDeleting(true)
          } else {
            setTypingSpeed(150) // Normal typing speed
          }

          return nextText
        })
      } else {
        // Deleting
        setText((prev) => {
          const nextText = prev.substring(0, prev.length - 1)

          // If we've deleted everything
          if (nextText === "") {
            setIsDeleting(false)
            setLoopNum(loopNum + 1)
            setTypingSpeed(500) // Pause before typing the next word
          } else {
            setTypingSpeed(100) // Faster when deleting
          }

          return nextText
        })
      }
    }

    // Set up the timeout for the next character
    timeoutRef.current = setTimeout(handleTyping, typingSpeed)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, isDeleting, loopNum, currentWordIndex, words])

  const features = [
    {
      icon: Users,
      title: "Staff Management",
      description: "Manage staff records with a complete overview.",
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      icon: FileCheck,
      title: "Document Uploads",
      description: "Securely store and manage staff documentation.",
      iconClass: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Compliance Tracking",
      description: "Stay Ofsted-ready with real-time compliance tracking.",
      iconClass: "bg-teal-100 text-teal-600",
    },
    {
      icon: Users,
      title: "Staff Profiles",
      description: "Complete profiles with qualifications and history.",
      iconClass: "bg-rose-100 text-rose-600",
    },
    {
      icon: Building,
      title: "Multi Venue",
      description: "Track compliance across venues with live dashboards.",
      iconClass: "bg-green-100 text-green-600",
    },
    {
      icon: Clock,
      title: "Task Management",
      description: "Assign and track venue tasks across multiple locations easily.",
      iconClass: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-teal-500 hover:bg-teal-50" asChild>
                <Link href="http://app.heyed.co.uk/">Login</Link>
              </Button>
              <Button onClick={() => setIsCalendlyOpen(true)}>
                Book Demo
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-gray-50"
            style={{
              backgroundImage: "url('./gradient.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Background Decorative Elements */}
          <div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-teal-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>

          {/* Content with relative positioning to appear above background */}
          <Container className="relative z-10 px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="grid gap-6 sm:gap-8 md:gap-12 xl:grid-cols-2 xl:gap-16 2xl:grid-cols-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-4 sm:space-y-6 md:space-y-8 2xl:col-span-2"
              >
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl/none xl:text-6xl/none font-bold tracking-tighter">
                    {/* Desktop version with typewriter effect */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="hidden 2xl:block"
                    >
                      Automated staff records & task tracking for
                    </motion.span>

                    <div className="hidden 2xl:block h-[1.25em] relative">
                      <span className="text-teal-500">
                        {text}
                        <span className="animate-pulse">|</span>
                      </span>
                    </div>

                    {/* Mobile version with typewriter effect */}
                    <div className="2xl:hidden">
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        Automated staff<br className="hidden xl:block 2xl:hidden" /> records & task tracking for<br className="hidden xl:block 2xl:hidden" />
                      </motion.span>
                      <span className="inline min-[400px]:hidden lg:hidden">{' '}</span>
                      <br className="min-[400px]:hidden lg:hidden" />
                      <span className="hidden min-[400px]:inline xl:hidden">{' '}</span>
                      <span className="text-teal-500">
                        {text}
                        <span className="animate-pulse">|</span>
                      </span>
                    </div>
                  </h1>
                  <p className="max-w-[600px] xl:max-w-none xl:w-max text-gray-500 md:text-lg xl:text-xl">
                    Purpose-built for nurseries, schools and clubs to meet<br className="hidden xl:block" /> Ofsted requirements and maintain inspection-ready compliance.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="https://app.heyed.co.uk/signup">Start Free Trial</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-teal-500 hover:bg-teal-50"
                    onClick={() => setIsCalendlyOpen(true)}
                  >
                    Book a Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-teal-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-teal-500" />
                    <span>30-day free trial</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="flex items-center justify-center -mx-6 sm:mx-0 2xl:col-span-3"
              >
                <HeroIllustration />
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id="features" className="pt-16 pb-16 md:pt-20 md:pb-20 bg-gray-50 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute -left-40 top-40 w-80 h-80 rounded-full border border-teal-200/30 -z-10"></div>
          <div className="absolute -right-40 bottom-40 w-80 h-80 rounded-full border border-blue-200/30 -z-10"></div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gray-200/50 -z-10"></div>

          <Container>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <div className="inline-block rounded-card bg-teal-100 px-3 py-1 text-sm text-teal-700">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Everything you need to manage your childcare business.
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Centralise staff records, automate compliance tracking, and streamline task management across all your venues.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16 xl:max-w-6xl 2xl:max-w-7xl">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center space-y-2 rounded-card border bg-white p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-lg hover:scale-[1.01] sm:hover:scale-100 sm:hover:-translate-y-1 sm:duration-500 sm:ease-in-out md:opacity-0 md:animate-fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className={`rounded-full p-2 ${feature.iconClass} md:transition-transform md:hover:scale-110`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Screenshot Scroll Section with Hijacking */}
        <ScreenshotScrollSection />

        {/* Video Section */}
        <section className="pt-10 pb-16 md:pt-14 md:pb-20 bg-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full bg-teal-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>

          <Container className="relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Single Central Record
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Maintain complete single central records with automated compliance reminders and secure staff document uploads.
                </p>
              </div>
            </div>

            {/* Video player with correct aspect ratio */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div
                className="relative shadow-2xl rounded-card overflow-hidden bg-black"
                style={{ aspectRatio: "5813 / 3375" }}
              >
                <video
                  src="https://oxabxfydvltdhxekaqym.supabase.co/storage/v1/object/public/public-assets//heyed_demo.mp4"
                  poster="/images/heyed-demo-poster.png"
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

            </div>
          </Container>
        </section>

        {/* Pricing Calculator Section */}
        <section id="pricing" className="py-16 md:py-20 bg-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>

          <Container>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <div className="inline-block rounded-card bg-teal-100 px-3 py-1 text-sm text-teal-700">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Simple, transparent pricing
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Choose the perfect plan for your team size. All features included, no hidden fees.
                </p>
              </div>
            </div>
            <div className="mt-16">
              <PricingCalculator />
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute -left-20 top-40 w-40 h-40 rounded-full bg-teal-50 blur-2xl -z-10"></div>
          <div className="absolute -right-20 bottom-40 w-40 h-40 rounded-full bg-blue-50 blur-2xl -z-10"></div>

          <Container>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <div className="inline-block rounded-card bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Trusted by education professionals
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  See what our customers are saying about how our platform has transformed their staff management.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16 xl:max-w-6xl 2xl:max-w-7xl">
              {[
                {
                  quote:
                    "HeyEd. has made the central record one less thing to think about. We have peace of mind we're always Ofsted-ready.",
                  author: "Lauren Cooper",
                  role: "Assistant Headteacher",
                  organization: "Monkfrith Primary",
                  rating: 5,
                },
                {
                  quote:
                    "Our last Ofsted inspection was a breeze thanks to HeyEd. All our documentation was ready at the click of a button.",
                  author: "Emma Richards",
                  role: "Compliance Officer",
                  organization: "Little Learners",
                  rating: 5,
                },
                {
                  quote:
                    "HeyEd. has streamlined our compliance processes significantly. The automated alerts and document tracking have saved us countless hours.",
                  author: "Nikhil Jagpal",
                  role: "Compliance Officer",
                  organization: "Residency London College",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between space-y-4 rounded-card border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 md:opacity-0 md:animate-fadeIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute -right-3 -top-3 rounded-full bg-teal-100 p-2">
                    <svg
                      className="h-6 w-6 text-teal-700 rotate-12 transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-base font-semibold border-2 border-teal-200 select-none">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.organization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>

          <Container>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <div className="inline-block rounded-card bg-teal-100 px-3 py-1 text-sm text-teal-700">FAQs</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Frequently Asked Questions
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Everything you need to know about HeyEd and how it can help your organisation.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-16 xl:max-w-5xl">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border rounded-card bg-white shadow-sm px-6 py-1">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="text-left">How does HeyEd help with Ofsted compliance?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    HeyEd automatically tracks and manages all necessary documentation, certifications, and training
                    records required for Ofsted compliance. Our system provides real-time alerts for expiring documents
                    and maintains a complete audit trail, ensuring you're always inspection-ready.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border rounded-card bg-white shadow-sm px-6 py-1">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="text-left">Can I import existing staff records?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes! HeyEd provides a simple import tool that allows you to bulk upload your existing staff records.
                    We support various file formats including CSV and Excel, and our team can assist with the migration
                    process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border rounded-card bg-white shadow-sm px-6 py-1">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="text-left">What security measures are in place?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We take security seriously. HeyEd uses bank-level encryption for all data, maintains regular
                    backups, and complies with GDPR requirements. All data is stored in secure UK-based data centers,
                    and we implement strict access controls and authentication measures.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border rounded-card bg-white shadow-sm px-6 py-1">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="text-left">Do you offer training and support?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    All plans include comprehensive onboarding, regular training sessions, and dedicated customer
                    support. Our support team is available via email, phone, and chat to help you get the most out of
                    HeyEd.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border rounded-card bg-white shadow-sm px-6 py-1">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="text-left">Can I try HeyEd before committing?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, we offer a 30-day free trial with full access to all features. No credit card is required to
                    start your trial, and our team will help you set everything up to ensure you can properly evaluate
                    HeyEd for your organisation.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0 z-0 bg-gray-50"
            style={{
              backgroundImage: "url('./gradient.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Background Decorative Elements */}
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full bg-teal-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blue-100/20 blur-3xl -z-10 animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>

          <Container className="relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4 max-w-[85rem] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  Ready to simplify your staff compliance?
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Join forward-thinking education professionals who are transforming their staff management with HeyEd.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="https://app.heyed.co.uk/signup">Start Free Trial</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-teal-500 hover:bg-teal-50"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Book a Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500">No credit card required. 30-day free trial.</p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  )
}
