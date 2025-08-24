import type { Metadata } from "next"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Data Processing Agreement (DPA) | HeyEd - GDPR Compliance",
  description: "Read HeyEd's Data Processing Agreement outlining how we handle personal data for UK nurseries and clubs in compliance with GDPR and UK data protection laws.",
  keywords: "data processing agreement, DPA, GDPR compliance, data protection, UK nursery software, personal data, privacy",
  openGraph: {
    title: "Data Processing Agreement | HeyEd",
    description: "Comprehensive DPA outlining HeyEd's data processing practices for UK nurseries and clubs, ensuring GDPR compliance and data security.",
    url: "https://heyed.co.uk/dpa",
  },
  twitter: {
    card: "summary",
    title: "Data Processing Agreement | HeyEd",
    description: "Learn about HeyEd's data processing practices and GDPR compliance for UK childcare providers.",
  },
}

export default function DPAPage() {
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
              <h1 className="text-4xl font-bold mb-4">Data Processing Agreement (DPA)</h1>
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
                    This Data Processing Agreement ("DPA") forms part of the agreement between Hey Tech Labs Ltd (trading as "HeyEd") and the Client (each a "Party" and together the "Parties").
                  </p>
                </div>
              </section>

              {/* Parties and Scope */}
              <section>
                <h2 className="text-2xl font-bold">1. Parties and Scope</h2>
                <div className="mt-4 space-y-4">
                  <p>This DPA applies to all customers using HeyEd and governs how we process personal data on your behalf.</p>
                  <ul className="list-none space-y-2">
                    <li><strong>Data Processor:</strong> Hey Tech Labs Ltd (Company No. 15972086)</li>
                    <li><strong>Data Controller:</strong> You (the Client)</li>
                    <li><strong>Services:</strong> The HeyEd platform, including compliance tracking, document storage, staff onboarding, and operational tools for Ofsted-registered settings.</li>
                  </ul>
                </div>
              </section>

              {/* Nature and Purpose */}
              <section>
                <h2 className="text-2xl font-bold">2. Nature and Purpose of Processing</h2>
                <div className="mt-4 space-y-4">
                  <p>We process personal data for the sole purpose of providing our Services, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Managing staff records, documents, and training</li>
                    <li>Tracking compliance status and alerts</li>
                    <li>Supporting onboarding and safeguarding logs</li>
                  </ul>
                </div>
              </section>

              {/* Types of Personal Data */}
              <section>
                <h2 className="text-2xl font-bold">3. Types of Personal Data</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Staff names</li>
                    <li>DBS certificate numbers</li>
                    <li>Email addresses</li>
                    <li>Right-to-work documentation</li>
                    <li>Qualifications and training records</li>
                    <li>Uploaded certificates and documents</li>
                  </ul>
                </div>
              </section>

              {/* Categories of Data Subjects */}
              <section>
                <h2 className="text-2xl font-bold">4. Categories of Data Subjects</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Staff employed or contracted by the Client</li>
                    <li>Managers and Head Office contacts</li>
                  </ul>
                </div>
              </section>

              {/* Duration of Processing */}
              <section>
                <h2 className="text-2xl font-bold">5. Duration of Processing</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    We process personal data for the duration of your subscription. After termination, data is retained for a grace period of 90 days unless otherwise agreed.
                  </p>
                </div>
              </section>

              {/* Data Storage and Transfers */}
              <section>
                <h2 className="text-2xl font-bold">6. Data Storage and Transfers</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All data is stored within the UK and/or EEA.</li>
                    <li>We do not transfer personal data outside the UK without your instruction or appropriate safeguards (e.g., SCCs).</li>
                  </ul>
                </div>
              </section>

              {/* Sub-Processors */}
              <section>
                <h2 className="text-2xl font-bold">7. Sub-Processors</h2>
                <div className="mt-4 space-y-4">
                  <p>We use the following sub-processors to deliver our services:</p>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Processor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">AWS (S3)</td>
                        <td className="px-6 py-4 text-sm">File and data storage</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">UK/EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">MySQL (RDS)</td>
                        <td className="px-6 py-4 text-sm">Core database hosting</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">UK/EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Stripe</td>
                        <td className="px-6 py-4 text-sm">Payment processing</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">UK/EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Resend / SMTP</td>
                        <td className="px-6 py-4 text-sm">Transactional email delivery</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Google Workspace</td>
                        <td className="px-6 py-4 text-sm">Internal support operations</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">UK/EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Hotjar (if enabled)</td>
                        <td className="px-6 py-4 text-sm">UX session tracking</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">EU</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Sentry (if enabled)</td>
                        <td className="px-6 py-4 text-sm">Error logging (pseudonymous)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">EU</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> We do not provide advanced sub-processor change notices by default.
                  </p>
                </div>
              </section>

              {/* Security Measures */}
              <section>
                <h2 className="text-2xl font-bold">8. Security Measures</h2>
                <div className="mt-4 space-y-4">
                  <p>We implement the following controls:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption in transit (TLS) and at rest (S3-managed encryption)</li>
                    <li>ISO 27001 certified infrastructure (AWS)</li>
                    <li>Role-based access controls</li>
                    <li>2FA support for users</li>
                    <li>Secure authentication tokens (moving to HttpOnly cookies)</li>
                    <li>Rate-limiting, email verification, and password policy enforcement</li>
                    <li>Regular backups and monitoring</li>
                  </ul>
                </div>
              </section>

              {/* Breach Notification */}
              <section>
                <h2 className="text-2xl font-bold">9. Breach Notification</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    We will notify you within 48 hours of becoming aware of any personal data breach that affects your data, providing relevant details and mitigation steps.
                  </p>
                </div>
              </section>

              {/* Your Rights and Instructions */}
              <section>
                <h2 className="text-2xl font-bold">10. Your Rights and Instructions</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We will only process personal data on your written instructions (including through the use of HeyEd).</li>
                    <li>We assist you in responding to data subject access requests (SARs), rectification, erasure, restriction, and data portability as required by UK GDPR.</li>
                  </ul>
                </div>
              </section>

              {/* Data Retention and Deletion */}
              <section>
                <h2 className="text-2xl font-bold">11. Data Retention and Deletion</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal data is deleted within 90 days of subscription termination unless legal obligations require retention.</li>
                    <li>Clients may request data export prior to deletion.</li>
                  </ul>
                </div>
              </section>

              {/* Audits and Records */}
              <section>
                <h2 className="text-2xl font-bold">12. Audits and Records</h2>
                <div className="mt-4">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We maintain records of all processing activities under UK GDPR Article 30.</li>
                    <li>We will cooperate with reasonable audit requests, subject to confidentiality and operational limitations.</li>
                  </ul>
                </div>
              </section>

              {/* Liability */}
              <section>
                <h2 className="text-2xl font-bold">13. Liability</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    Each Party's liability under this DPA is subject to the limitations of liability in the main service agreement.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold">14. Governing Law</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    This DPA is governed by the laws of England and Wales.
                  </p>
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