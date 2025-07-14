"use client";

import { Container } from "@/components/ui/container";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { FilloutStandardEmbed } from "@fillout/react";

export default function OnboardingPage() {
  const handlePageChange = () => {
    // Scroll to top when form page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/50 dark:bg-gray-950/50 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center justify-center">
              <Logo />
            </Link>
            <nav className="flex gap-6 items-center">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Back to Home
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Container className="py-6 md:py-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8 overflow-hidden">
            <FilloutStandardEmbed 
              filloutId="kwJJwfe3NMus"
              inheritParameters
              dynamicResize
              onPageChange={handlePageChange}
            />
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}