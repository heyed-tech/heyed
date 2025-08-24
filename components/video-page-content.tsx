"use client";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CalendlyModal } from "@/components/calendly-modal";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Footer } from "@/components/footer";

// Video Player Component with Mobile Poster Fix
function VideoPlayer() {
  const [videoStarted, setVideoStarted] = useState(false);

  const handleStartVideo = () => {
    setVideoStarted(true);
  };

  return (
    <div
      className="relative shadow-2xl rounded-card overflow-hidden"
      style={{ 
        aspectRatio: "16 / 9",
        backgroundColor: '#f1f5f9'
      }}
    >
      {!videoStarted ? (
        // Show poster with play button until user clicks
        <div 
          className="absolute inset-0 cursor-pointer group"
          onClick={handleStartVideo}
        >
          <Image
            src="/images/heyed-demo-poster.png"
            alt="HeyEd Demo Video"
            fill
            className="object-cover"
            priority
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Play className="h-8 w-8 text-teal-500 ml-1" />
            </div>
          </div>
        </div>
      ) : (
        // Show video after user clicks
        <video
          src="https://oxabxfydvltdhxekaqym.supabase.co/storage/v1/object/public/public-assets/Ad.mp4"
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default function VideoPageContent() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

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
              <Button variant="outline" className="border-teal-500 hover:bg-teal-50" asChild>
                <Link href="https://app.heyed.co.uk/">Login</Link>
              </Button>
              <Button onClick={() => setIsCalendlyOpen(true)}>
                Book Demo
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-20 bg-gray-50">
          <Container>
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Video Section */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter md:text-4xl/tight xl:text-5xl/tight">
                  See HeyEd in Action
                </h1>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg xl:text-xl">
                  Discover how HeyEd can transform your staff management and compliance tracking
                </p>
              </div>

              {/* Video player */}
              <VideoPlayer />

              {/* CTA Section */}
              <div className="bg-white rounded-card p-8 md:p-12 shadow-sm border text-center space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
                  Ready to streamline your staff management?
                </h2>
                <p className="mx-auto max-w-2xl text-gray-500 md:text-lg">
                  Book a personalised demo with our team and see how HeyEd can work for your organisation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => setIsCalendlyOpen(true)}
                  >
                    Schedule a Demo
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-teal-500 hover:bg-teal-50"
                    asChild
                  >
                    <Link href="https://app.heyed.co.uk/signup">Start Free Trial</Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  No credit card required • 30-day free trial • Setup in minutes
                </p>
              </div>
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
  );
}