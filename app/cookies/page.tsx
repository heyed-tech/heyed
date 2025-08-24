import type { Metadata } from "next"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Cookies Policy | HeyEd - Understanding Our Cookie Usage",
  description: "Learn about cookies used by HeyEd for UK nursery and club management software. Understand cookie types, purposes, and how to manage your preferences.",
  keywords: "cookies policy, privacy, data protection, website cookies, GDPR compliance, UK nursery software",
  openGraph: {
    title: "Cookies Policy | HeyEd",
    description: "Understand how HeyEd uses cookies to provide better service for UK nurseries and clubs. Complete policy and preference management.",
    url: "https://heyed.co.uk/cookies",
  },
  twitter: {
    card: "summary",
    title: "Cookies Policy | HeyEd",
    description: "Learn about HeyEd's cookie usage and data protection practices for UK childcare providers.",
  },
}

export default function CookiesPage() {
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
          <article className="mt-6 space-y-8 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-card border shadow-sm prose prose-slate max-w-none">
            <Button variant="ghost" asChild className="-ml-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <header className="not-prose">
              <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>
              <div className="space-y-1">
                <p className="text-gray-500 text-lg font-medium">Effective Date: April 14, 2025</p>
                <p className="text-gray-500 text-lg font-medium">Last Updated: July 14, 2025</p>
              </div>
            </header>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <div className="mt-4 space-y-4">
                  <p>
                    This Cookies Policy explains how Hey Tech Labs Ltd ("HeyEd", "we", "us", "our") uses cookies and similar technologies on our website and logged-in platform areas.
                  </p>
                  <p>
                    By continuing to use our website or platform, you agree to the use of cookies as described in this policy.
                  </p>
                </div>
              </section>

              {/* What Are Cookies */}
              <section>
                <h2 className="text-2xl font-bold">1. What Are Cookies?</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    Cookies are small text files placed on your device (computer, tablet, mobile) when you visit a website. They allow us to recognise your browser and store certain information.
                  </p>
                </div>
              </section>

              {/* Types of Cookies */}
              <section>
                <h2 className="text-2xl font-bold">2. Types of Cookies We Use</h2>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Strictly Necessary Cookies</td>
                        <td className="px-6 py-4 text-sm">Enable core functionality such as secure login and navigation. These cannot be disabled.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Performance Cookies</td>
                        <td className="px-6 py-4 text-sm">Help us understand how users interact with the site (e.g., page visits, errors).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Functionality Cookies</td>
                        <td className="px-6 py-4 text-sm">Remember preferences and custom settings (e.g., your last logged-in venue).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Analytics & Session Recording Cookies</td>
                        <td className="px-6 py-4 text-sm">Collect anonymised analytics and heatmaps via third-party tools.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Cookies We Set */}
              <section>
                <h2 className="text-2xl font-bold">3. Cookies We Set</h2>
                <div className="mt-4 space-y-4">
                  <p>Here are the main cookies and technologies used on HeyEd:</p>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Google Analytics</td>
                        <td className="px-6 py-4 text-sm">Website analytics</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Up to 2 years</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Hotjar</td>
                        <td className="px-6 py-4 text-sm">Session recording and heatmaps</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Session cookies</td>
                        <td className="px-6 py-4 text-sm">Login and platform navigation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Session-based</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Stripe</td>
                        <td className="px-6 py-4 text-sm">Secure payment handling</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Varies</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Third-Party Tools */}
              <section>
                <h2 className="text-2xl font-bold">4. Third-Party Tools</h2>
                <div className="mt-4 space-y-4">
                  <p>We use third-party services that may set cookies, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics</li>
                    <li>Hotjar</li>
                    <li>Resend (email delivery)</li>
                    <li>Stripe (payments)</li>
                  </ul>
                  <p>
                    These providers may collect data subject to their own privacy policies.
                  </p>
                </div>
              </section>

              {/* Managing Cookie Preferences */}
              <section>
                <h2 className="text-2xl font-bold">5. Managing Your Cookie Preferences</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    You can control and manage cookies in your browser settings. Most browsers let you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>View which cookies are stored</li>
                    <li>Delete existing cookies</li>
                    <li>Block all or selected cookies</li>
                  </ul>
                  <p>
                    <strong>Note:</strong> Disabling cookies may affect the functionality of our platform.
                  </p>
                </div>
              </section>

              {/* Consent */}
              <section>
                <h2 className="text-2xl font-bold">6. Consent</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    We do not show a cookie banner in logged-in areas, where tracking is part of the platform functionality and contract.
                  </p>
                  <p>
                    For visitors to our public website, you can choose whether to allow non-essential cookies.
                  </p>
                </div>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="text-2xl font-bold">7. Changes to This Policy</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    We may update this Cookies Policy from time to time. Please check this page periodically for changes.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold">8. Contact</h2>
                <div className="mt-4 space-y-4">
                  <p>For questions or concerns about this policy, contact:</p>
                  <div className="space-y-2">
                    <p><strong>Hey Tech Labs Ltd</strong></p>
                    <p>
                      <Link href="mailto:legal@heyed.co.uk" className="text-teal-500 hover:underline">
                        legal@heyed.co.uk
                      </Link>
                    </p>
                    <p>128 City Road, London, EC1V 2NX</p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}