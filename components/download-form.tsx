"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Download, Mail, User } from "lucide-react"
import Image from "next/image"
import { Logo } from "@/components/logo"
import { registerPDFDownload } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/footer"

export default function DownloadForm() {
  const { toast } = useToast()
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      const result = await registerPDFDownload(formData)
      
      if (result.success && result.pdfUrl) {
        toast({
          title: "Success!",
          description: "Your download will start shortly.",
        })
        
        // Open PDF in new window
        window.open(result.pdfUrl, '_blank')
        
        formRef.current?.reset()
      } else {
        throw new Error(result.error || "Failed to get download link")
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
                Features
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                Testimonials
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button className="bg-teal-500 hover:bg-teal-600 rounded-button">Get Started</Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1 relative">
        {/* Background gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/gradient.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container className="py-6 md:py-8 lg:py-12 relative z-10">
          <div className="mt-4 md:mt-6 bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-card border shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Left column - PDF Info */}
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 relative h-64 lg:h-full">
                {/* Small image for mobile screens */}
                <Image 
                  src="/images/Small EYFS Safeguarding Changes 2025.png" 
                  alt="HeyEd Safeguarding Guide"
                  fill
                  className="object-cover sm:hidden"
                  sizes="100vw"
                />
                {/* Mobile image for tablet screens */}
                <Image 
                  src="/images/Mobile EYFS Safeguarding Changes 2025.png" 
                  alt="HeyEd Safeguarding Guide"
                  fill
                  className="object-cover hidden sm:block lg:hidden"
                  sizes="100vw"
                />
                {/* Desktop image for larger screens */}
                <Image 
                  src="/images/HeyEd. Safeguarding.png" 
                  alt="HeyEd Safeguarding Guide"
                  fill
                  className="object-cover hidden lg:block"
                  sizes="50vw"
                />
              </div>

              {/* Right column - Form */}
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                <div className="text-center mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">Download Your Free Guide</h1>
                  <p className="text-gray-500 text-sm px-4 sm:px-0">Fill out the form below to get instant access</p>
                </div>

                <form ref={formRef} onSubmit={async (e) => { 
                  e.preventDefault(); 
                  const formData = new FormData(e.currentTarget); 
                  await onSubmit(formData); 
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="pl-9"
                        disabled={isPending}
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        className="pl-9" 
                        disabled={isPending} 
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company"
                        className="pl-9"
                        disabled={isPending}
                      />
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <Input
                        id="role"
                        name="role"
                        placeholder="Your role"
                        className="pl-9"
                        disabled={isPending}
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-600" 
                    disabled={isPending}
                  >
                    {isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        Download PDF
                        <Download className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By downloading, you agree to receive occasional emails about HeyEd updates and features.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}