"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building2, Mail, Phone, Send } from "lucide-react"
import { Logo } from "@/components/logo"
import { submitContactForm } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"

export default function Contact() {
  const { toast } = useToast()
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      await submitContactForm(formData)
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
      formRef.current?.reset()
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
              {/* Login link removed/disabled until the app is ready */}
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

        <Container className="py-8 md:py-12 relative z-10">
          <div className="mt-6 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-card border shadow-sm max-w-xl mx-auto">
            <Button variant="ghost" asChild className="-ml-4 mb-6">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
              <p className="text-gray-500">Get in touch with our team</p>
            </div>

            <form ref={formRef} action={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <Input id="name" name="name" placeholder="Your name" required className="pl-9" disabled={isPending} />
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="phone">Phone (optional)</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="pl-9"
                    disabled={isPending}
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Contact</Label>
                <Select name="reason" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joining">Interested in Joining</SelectItem>
                    <SelectItem value="help">Need Help</SelectItem>
                    <SelectItem value="press">Press Inquiry</SelectItem>
                    <SelectItem value="partnerships">Partnerships</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  className="min-h-[150px] resize-none"
                  required
                  disabled={isPending}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
