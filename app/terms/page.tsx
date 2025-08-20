import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export default function TermsOfService() {
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
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-gray-500 text-lg font-medium">Last Updated: March 2, 2025</p>
            </header>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <div className="mt-4">
                  <p>
                    Welcome to HeyEd. ("we," "our," or "us"), a B2B SaaS platform designed for UK childcare providers.
                    These Terms of Service ("Terms") govern your access to and use of the HeyEd. platform, including any
                    associated mobile applications, websites, and services (collectively, the "Service").
                  </p>
                  <p className="mt-4">
                    By accessing or using the Service, you agree to be bound by these Terms. If you are using the
                    Service on behalf of an organisation (such as a nursery, out of school club, school, or
                    Multi-Academy Trust), you represent and warrant that you have the authority to bind that
                    organisation to these Terms, and references to "you" and "your" in these Terms refer to both you and
                    that organisation.
                  </p>
                </div>
              </section>

              {/* Description of Service */}
              <section>
                <h2 className="text-2xl font-bold">2. Description of Service</h2>
                <div className="mt-4">
                  <p>
                    HeyEd. provides a comprehensive platform for compliance and HR management in the education sector,
                    featuring:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li>Staff Management Hub, including Digital Single Central Record</li>
                    <li>Professional Development Platform</li>
                    <li>Automated compliance tools and alerts</li>
                    <li>Document verification systems</li>
                  </ul>
                  <p className="mt-4">
                    Our Service is intended solely for use by Ofsted-registered childcare providers and educational
                    institutions in the United Kingdom.
                  </p>
                </div>
              </section>

              {/* Account Registration and Security */}
              <section>
                <h2 className="text-2xl font-bold">3. Account Registration and Security</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">3.1 Account Creation</h3>
                    <p className="mt-2">
                      To use the Service, you must register for an account. You agree to provide accurate, current, and
                      complete information during the registration process and to update such information to keep it
                      accurate, current, and complete.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">3.2 Account Security</h3>
                    <p className="mt-2">You are responsible for:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying us immediately of any unauthorised access or use of your account</li>
                      <li>Ensuring that all users in your organisation comply with these Terms</li>
                    </ul>
                    <p className="mt-4">
                      We reserve the right to disable any user account if we reasonably believe you have violated these
                      Terms.
                    </p>
                  </div>
                </div>
              </section>

              {/* Subscription and Payment */}
              <section>
                <h2 className="text-2xl font-bold">4. Subscription and Payment</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">4.1 Subscription Model</h3>
                    <p className="mt-2">
                      HeyEd. operates on a SaaS subscription model based on provider size. Additional modules and
                      features may be available at extra cost.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">4.2 Payment Terms</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>All fees are due in advance according to your selected billing cycle</li>
                      <li>
                        Subscription fees are non-refundable except as required by law or as expressly stated in these
                        Terms
                      </li>
                      <li>You authorise us to charge your designated payment method for all fees incurred</li>
                      <li>Fees are exclusive of all taxes, which you are responsible for paying</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">4.3 Subscription Changes and Cancellation</h3>
                    <p className="mt-2">
                      You may change or cancel your subscription according to the procedures set forth in the Service.
                      Changes will take effect at the end of the current billing cycle unless otherwise specified.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Privacy and Security */}
              <section>
                <h2 className="text-2xl font-bold">5. Data Privacy and Security</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">5.1 Data Processing</h3>
                    <p className="mt-2">
                      In providing the Service, we act as a data processor for the personal data you upload or create
                      within the Service. You remain the data controller for such information. Our processing of
                      personal data is governed by our Data Processing Agreement, which forms part of these Terms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">5.2 Compliance with Data Protection Laws</h3>
                    <p className="mt-2">
                      Both parties agree to comply with all applicable data protection laws, including but not limited
                      to the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">5.3 Security Measures</h3>
                    <p className="mt-2">
                      We implement appropriate technical and organisational measures to protect your data. However, no
                      method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">5.4 Data Retention and Deletion</h3>
                    <p className="mt-2">
                      We will retain your data for as long as your account is active or as needed to provide the
                      Service. Upon termination, we will delete or anonymise your data within 90 days unless legal
                      obligations require longer retention.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Responsibilities and Restrictions */}
              <section>
                <h2 className="text-2xl font-bold">6. User Responsibilities and Restrictions</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">6.1 Acceptable Use</h3>
                    <p className="mt-2">
                      You agree to use the Service only for lawful purposes and in accordance with these Terms. You are
                      responsible for ensuring that your use of the Service complies with all applicable laws and
                      regulations, including those related to data protection, safeguarding, and educational standards.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">6.2 Prohibited Activities</h3>
                    <p className="mt-2">You shall not:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Use the Service to store or transmit harmful code or material</li>
                      <li>Attempt to gain unauthorised access to the Service or related systems</li>
                      <li>Interfere with or disrupt the integrity or performance of the Service</li>
                      <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service</li>
                      <li>Use the Service in a manner that exceeds reasonable usage limits</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">6.3 Content Responsibilities</h3>
                    <p className="mt-2">
                      You retain ownership of all data and content you submit to the Service. You grant us a limited
                      licence to use such content solely for the purpose of providing and improving the Service. You
                      represent and warrant that you have all necessary rights to grant this licence.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property Rights */}
              <section>
                <h2 className="text-2xl font-bold">7. Intellectual Property Rights</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">7.1 Our Intellectual Property</h3>
                    <p className="mt-2">
                      The Service and its original content, features, and functionality are owned by HeyEd. and are
                      protected by international copyright, trademark, patent, trade secret, and other intellectual
                      property laws. You may not reproduce, modify, create derivative works from, or distribute any
                      portion of the Service without our prior written consent.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">7.2 Feedback</h3>
                    <p className="mt-2">
                      If you provide us with feedback or suggestions regarding the Service, you grant us an unlimited,
                      irrevocable, perpetual, sublicensable, transferable, royalty-free licence to use such feedback for
                      any purpose without compensation to you.
                    </p>
                  </div>
                </div>
              </section>

              {/* Third-Party Services and Links */}
              <section>
                <h2 className="text-2xl font-bold">8. Third-Party Services and Links</h2>
                <div className="mt-4">
                  <p>
                    The Service may contain links to or integrate with third-party websites or services. We are not
                    responsible for the content or practices of these third parties, and your interactions with them are
                    solely between you and the third party.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold">9. Termination</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">9.1 Term</h3>
                    <p className="mt-2">These Terms will remain in effect until terminated by either party.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">9.2 Termination by You</h3>
                    <p className="mt-2">
                      You may terminate these Terms at any time by cancelling your subscription and ceasing all use of
                      the Service.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">9.3 Termination by Us</h3>
                    <p className="mt-2">
                      We may terminate or suspend your access to the Service immediately, without prior notice or
                      liability, for any reason, including if you breach these Terms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">9.4 Effects of Termination</h3>
                    <p className="mt-2">Upon termination:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Your right to use the Service will immediately cease</li>
                      <li>Any fees paid in advance will not be refunded</li>
                      <li>
                        All provisions of these Terms which by their nature should survive termination shall survive
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold">10. Limitation of Liability</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">10.1 Disclaimer of Warranties</h3>
                    <p className="mt-2">
                      The Service is provided "as is" and "as available" without warranties of any kind, either express
                      or implied, including but not limited to implied warranties of merchantability, fitness for a
                      particular purpose, and non-infringement.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">10.2 Limitation of Liability</h3>
                    <p className="mt-2">
                      To the fullest extent permitted by law, in no event shall HeyEd. be liable for any indirect,
                      incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                      whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible
                      losses, resulting from:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Your use or inability to use the Service</li>
                      <li>
                        Any unauthorised access to or use of our servers and/or any personal information stored therein
                      </li>
                      <li>Any interruption or cessation of transmission to or from the Service</li>
                      <li>
                        Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">10.3 Cap on Liability</h3>
                    <p className="mt-2">
                      Our total liability to you for any damages shall not exceed the amount paid by you to us for the
                      Service during the twelve (12) months preceding the claim.
                    </p>
                  </div>
                </div>
              </section>

              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-bold">11. Indemnification</h2>
                <div className="mt-4">
                  <p>
                    You agree to defend, indemnify, and hold harmless HeyEd., its affiliates, licensors, and service
                    providers, and its and their respective officers, directors, employees, contractors, agents,
                    licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages,
                    judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising
                    out of or relating to your violation of these Terms or your use of the Service.
                  </p>
                </div>
              </section>

              {/* Modifications to the Service and Terms */}
              <section>
                <h2 className="text-2xl font-bold">12. Modifications to the Service and Terms</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">12.1 Changes to the Service</h3>
                    <p className="mt-2">
                      We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any
                      part thereof) with or without notice.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">12.2 Changes to Terms</h3>
                    <p className="mt-2">
                      We may modify these Terms from time to time. The updated Terms will be posted on the Service, and
                      we will notify you through the Service or by email. Your continued use of the Service after the
                      effective date of the revised Terms constitutes your acceptance of the changes.
                    </p>
                  </div>
                </div>
              </section>

              {/* General Provisions */}
              <section>
                <h2 className="text-2xl font-bold">13. General Provisions</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">13.1 Governing Law</h3>
                    <p className="mt-2">
                      These Terms shall be governed by and construed in accordance with the laws of England and Wales,
                      without regard to its conflict of law principles.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">13.2 Dispute Resolution</h3>
                    <p className="mt-2">
                      Any dispute arising from or relating to these Terms or the Service shall be subject to the
                      exclusive jurisdiction of the courts of England and Wales.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">13.3 Severability</h3>
                    <p className="mt-2">
                      If any provision of these Terms is found to be unenforceable or invalid, that provision will be
                      limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in
                      full force and effect.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">13.4 No Waiver</h3>
                    <p className="mt-2">
                      Our failure to enforce any right or provision of these Terms will not be considered a waiver of
                      such right or provision.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">13.5 Assignment</h3>
                    <p className="mt-2">
                      You may not assign or transfer these Terms, by operation of law or otherwise, without our prior
                      written consent. We may assign these Terms in connection with a merger, acquisition,
                      reorganisation, or sale of all or substantially all of our assets without your consent.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">13.6 Entire Agreement</h3>
                    <p className="mt-2">
                      These Terms, together with any amendments and any additional agreements you may enter into with
                      HeyEd. in connection with the Service, constitute the entire agreement between you and HeyEd.
                      concerning the Service and supersede all prior or contemporaneous communications.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold">14. Contact Information</h2>
                <div className="mt-4 space-y-4">
                  <p>If you have any questions about these Terms, please contact us at:</p>
                  <div className="not-prose bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold">HeyEd.</p>
                    <p>Email: legal@heyed.co.uk</p>
                    <p className="font-bold">Hey Tech Labs Ltd</p>
                    <p>Address: 128 City Road, London, EC1V 2NX</p>
                    <p>Phone: +44 20 8044 9313</p>
                  </div>
                </div>
              </section>
            </div>

            <hr className="my-8" />

            <footer className="not-prose">
              <p className="text-gray-600">
                By using HeyEd., you acknowledge that you have read, understood, and agree to be bound by these Terms of
                Service.
              </p>
            </footer>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
