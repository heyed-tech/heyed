"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Container } from "@/components/ui/container"

export default function ScreenshotScrollSection() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Return placeholder during SSR
  if (!mounted) {
    return <div style={{ height: '300vh', backgroundColor: '#f9fafb' }} />
  }

  return <ScrollContent isMobile={isMobile} />
}

function ScrollContent({ isMobile }: { isMobile: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Now we can safely use scroll hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Image opacity transforms - with extended hold periods for 400vh scroll
  // Mobile gets slightly more time on first image
  const image1EndMobile = 0.42  // increased from 0.35
  const image2StartMobile = 0.45  // increased from 0.38
  
  const image1Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.40, 0.43], 
    [0, 1, 1, 0]
  )
  const image1Scale = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.40, 0.43], 
    [0.98, 1, 1, 0.98]
  )
  
  const image2Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.60, 0.63] : [0.40, 0.43, 0.60, 0.63], 
    [0, 1, 1, 0]
  )
  const image2Scale = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.60, 0.63] : [0.40, 0.43, 0.60, 0.63], 
    [0.98, 1, 1, 0.98]
  )
  
  const image3Opacity = useTransform(scrollYProgress, [0.60, 0.63, 0.68, 1], [0, 1, 1, 1])
  const image3Scale = useTransform(scrollYProgress, [0.60, 0.63, 0.68, 1], [0.98, 1, 1, 1])
  
  // Text opacity transforms - adjusted for 400vh
  const text1Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [0, 0.05, image1EndMobile, image2StartMobile] : [0, 0.05, 0.40, 0.43], 
    [0, 1, 1, 0]
  )
  const text2Opacity = useTransform(
    scrollYProgress, 
    isMobile ? [image1EndMobile, image2StartMobile, 0.60, 0.63] : [0.40, 0.43, 0.60, 0.63], 
    [0, 1, 1, 0]
  )
  const text3Opacity = useTransform(scrollYProgress, [0.60, 0.63, 0.68, 1], [0, 1, 1, 1])

  return (
    <section ref={sectionRef} className="relative h-[300vh] pt-0 pb-0 bg-gray-50">
      <div className="sticky top-0 min-h-screen bg-gray-50 flex items-center overflow-hidden" style={{ paddingTop: '80px' }}>
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
                Real-time updates as staff complete safeguarding tasks and training modules across your nursery group.
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
                Automatic compliance reminders and staff document management with secure cloud storage.
              </motion.p>
            </div>
            
            {/* Images section - with proper height to prevent cutoff */}
            <div className="relative w-full flex items-center justify-center mt-1 min-[400px]:mt-2 sm:mt-4 pb-16 sm:pb-24 min-h-[500px] min-[400px]:min-h-[550px] sm:min-h-[600px]">
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
                      className="relative w-full h-auto shadow-xl block md:hidden rounded-lg object-contain"
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