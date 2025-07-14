import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
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
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-gray-500 text-lg font-medium">Last Updated: July 14, 2025</p>
            </header>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    This website is operated by Hey Tech Labs Ltd (trading as HeyEd) (registered number 15972086) which has its registered
                    office address at 128 City Road, London, EC1V 2NX. This Privacy Policy sets out how Hey Tech
                    Labs Ltd uses and protects your personal data.
                  </p>
                  <p>
                    References in this Privacy Policy to "we", "us", "our" and "ourselves" are references to Hey Tech
                    Labs Ltd. We are a 'data controller' for the purposes of the Data Protection Act 2018 (DPA 2018) and
                    UK General Data Protection Regulation (UK GDPR) (i.e. we are
                    responsible for and control the processing of your personal information). We also act as a 'data
                    processor' for the purposes of DPA 2018 and UK GDPR in the course
                    of our business operations.
                  </p>
                  <p>
                    For more information about how we process data on behalf of our customers, please see our{" "}
                    <Link href="/dpa" className="text-teal-500 hover:underline">
                      Data Processing Agreement
                    </Link>.
                  </p>
                </div>
              </section>

              {/* What Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold">2. What Information We Collect</h2>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">2.1 Personal Information Provided by You</h3>
                    <div className="mt-4 space-y-4">
                      <p>
                        Information that you provide by filling in forms on our website. This includes information
                        provided at the time of registering to use our site, ordering any products or services described
                        on our website, posting any information or material or requesting further services.
                      </p>
                      <p>
                        HeyEd. does not capture or store data about visitors to its website. However, you may choose to
                        give us data such as your name, address, or email for enquiries. If this is the case, the data
                        received will be kept for 6 months. The data is kept for this period to allow for any follow up
                        enquiries and/or information.
                      </p>
                      <p>If we ask you for personal information, we will:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Make sure you know why we need it</li>
                        <li>Only ask for what we need</li>
                        <li>Make sure nobody has access to it who shouldn't</li>
                        <li>Keep it securely</li>
                        <li>Let you know if we share it with other organisations</li>
                        <li>Ask you to agree to us sharing your information where you have a choice</li>
                        <li>Only keep it for as long as we need to</li>
                        <li>Not make it available for commercial use (such as marketing) without your permission</li>
                        <li>Provide you with a copy of data we hold on you, on request</li>
                        <li>Have procedures in place for dealing promptly with any disputes/complaints</li>
                      </ul>
                      <p>In return, we ask you to give us accurate information.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">2.2 Personal Information About Other Individuals</h3>
                    <div className="mt-4">
                      <p>
                        If you give us information on behalf of someone else, you confirm that the other person has
                        appointed you to act on his/her behalf and has agreed that you can:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Give consent on his/her behalf to the processing of his/her personal data</li>
                        <li>Receive on his/her behalf any data protection notices</li>
                        <li>Give consent to the transfer of his/her personal data abroad</li>
                        <li>Give consent to the processing of his/her personal data</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">2.3 Monitoring and Recording Communications</h3>
                    <p className="mt-2">
                      We may monitor and record communications with you (such as telephone conversations and emails) for
                      the purpose of quality assurance, training, fraud prevention and compliance.
                    </p>
                  </div>
                </div>
              </section>

              {/* Legal Basis */}
              <section>
                <h2 className="text-2xl font-bold">3. Legal Basis</h2>
                <div className="mt-4 space-y-6">
                  <p>
                    The law requires us to have a legal basis for collecting and using your personal data. We rely on
                    one or more of the following legal bases:
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold">3.1 Performance of a Contract with You</h3>
                    <p className="mt-2">
                      Where we need to perform the contract we are about to enter into or have entered into with you.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">3.2 Legitimate Interests</h3>
                    <p className="mt-2">
                      We may use your personal data where it is necessary to conduct our business and pursue our
                      legitimate interests, for example to give you the best and most secure customer experience. We
                      make sure we consider and balance any potential impact on you and your rights (both positive and
                      negative) before we process your personal data for our legitimate interests. We do not use your
                      personal data for activities where our interests are overridden by the impact on you (unless we
                      have your consent or are otherwise required or permitted to by law).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">3.3 Legal Obligation</h3>
                    <p className="mt-2">
                      We may use your personal data where it is necessary for compliance with a legal obligation that we
                      are subject to. We will identify the relevant legal obligation when we rely on this legal basis.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">3.4 Consent</h3>
                    <p className="mt-2">
                      We rely on consent only where we have obtained your active agreement to use your personal data for
                      a specified purpose.
                    </p>
                  </div>
                </div>
              </section>

              {/* Use of Cookies */}
              <section>
                <h2 className="text-2xl font-bold">4. Use of Cookies</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    A cookie is a small text file which is placed onto your computer (or other electronic device) when
                    you use our website. We use cookies on our website.
                  </p>
                  <p>
                    For example, we may monitor how many times you visit the website, which pages you go to, traffic
                    data, location data and the originating domain name of a user's internet service provider. This
                    information helps us to build a profile of our users. Some of this data will be aggregated or
                    statistical, which means that we will not be able to identify you individually.
                  </p>
                  <p>
                    You can set your browser not to accept cookies and the websites below tell you how to remove cookies
                    from your browser. However, some of our website features may not function as a result.
                  </p>
                  <p>
                    For further information on our use of cookies please see our Cookie Policy here:{" "}
                    <Link href="/cookies" className="text-teal-500 hover:underline">
                      our Cookies Policy
                    </Link>
                  </p>
                  <p>
                    For further information on cookies generally visit{" "}
                    <Link href="http://www.aboutcookies.org" className="text-teal-500 hover:underline">
                      www.aboutcookies.org
                    </Link>{" "}
                    or{" "}
                    <Link href="http://www.allaboutcookies.org" className="text-teal-500 hover:underline">
                      www.allaboutcookies.org
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* How We Use the Information About You */}
              <section>
                <h2 className="text-2xl font-bold">5. How We Use the Information About You</h2>
                <div className="mt-4">
                  <p>We collect information about you so that we can:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Identify you and manage any accounts you hold with us</li>
                    <li>Process your order</li>
                    <li>Conduct research, statistical analysis and behavioural analysis</li>
                    <li>Carry out customer profiling and analyse your purchasing preferences</li>
                    <li>If you agree, let you know about other products or services that may be of interest to you</li>
                    <li>Detect and prevent fraud</li>
                    <li>Do due diligence checks</li>
                    <li>Customise our website and its content to your particular preferences</li>
                    <li>Notify you of any changes to our website or to our services that may affect you</li>
                    <li>Carry out security vetting</li>
                    <li>Improve our services</li>
                  </ul>
                </div>
              </section>

              {/* Disclosures of Your Personal Data */}
              <section>
                <h2 className="text-2xl font-bold">6. Disclosures of Your Personal Data</h2>
                <div className="mt-4 space-y-6">
                  <p>
                    We may share your personal data where necessary with the parties set out below for the purposes set
                    out under the above section 'How We Use the Information About You'.
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold">6.1 Specific Third Parties, Including:</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>AWS (Amazon Web Services) - for secure cloud infrastructure and data storage</li>
                      <li>Stripe - for payment processing</li>
                      <li>Google Analytics - for website analytics (see our Cookies Policy)</li>
                      <li>Hotjar - for user experience analytics (see our Cookies Policy)</li>
                      <li>Resend - for transactional email delivery</li>
                      <li>Google Workspace - for internal support operations</li>
                      <li>Sentry - for error logging and monitoring (pseudonymous data only)</li>
                      <li>
                        Third parties to whom we may choose to sell, transfer or merge parts of our business or our
                        assets. Alternatively, we may seek to acquire other businesses or merge with them. If a change
                        happens to our business, then the new owners may use your personal data in the same way as set
                        out in this Privacy Policy.
                      </li>
                    </ul>
                    <p className="mt-4">
                      We require all third parties to respect the security of your personal data and to treat it in
                      accordance with the law. We do not allow our third-party service providers to use your personal
                      data for their own purposes and only permit them to process your personal data for specified
                      purposes and in accordance with our instructions.
                    </p>
                  </div>
                </div>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-bold">7. International Transfers</h2>
                <div className="mt-4">
                  <p>We do not transfer your personal data outside the UK.</p>
                </div>
              </section>

              {/* Keeping Your Data Secure */}
              <section>
                <h2 className="text-2xl font-bold">8. Keeping Your Data Secure</h2>
                <div className="mt-4 space-y-4">
                  <p>We will use technical and organisational measures to safeguard your personal data, for example:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access to your account is controlled by a password and username that are unique to you</li>
                    <li>We store your personal data on secure servers</li>
                    <li>
                      Payment details are encrypted using SSL technology (typically you will see a lock icon or green
                      address bar (or both) in your browser when we use this technology)
                    </li>
                  </ul>
                  <p>
                    We use a certified ISO 27001 data centre. This family of standards helps us manage your information
                    and keep it safe and secure.
                  </p>
                  <p>
                    While we will use all reasonable efforts to safeguard your personal data, you acknowledge that the
                    use of the internet is not entirely secure and for this reason we cannot guarantee the security or
                    integrity of any personal data that are transferred from you or to you via the internet. If you have
                    any particular concerns about your information, please contact us (see the 'How to Contact Us'
                    section below).
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold">9. Data Security</h2>
                <div className="mt-4">
                  <p>
                    If you want detailed information from Get Safe Online on how to protect your information and your
                    computers and devices against fraud, identity theft, viruses and many other online problems, please
                    visit{" "}
                    <Link href="http://www.getsafeonline.org" className="text-teal-500 hover:underline">
                      www.getsafeonline.org
                    </Link>
                    . Get Safe Online is supported by HM Government and leading businesses.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold">10. Data Retention</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we
                    collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
                    reporting requirements. We may retain your personal data for a longer period in the event of a
                    complaint or if we reasonably believe there is a prospect of litigation in respect to our
                    relationship with you.
                  </p>
                  <p>
                    To determine the appropriate retention period for personal data, we consider the amount, nature and
                    sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure of
                    your personal data, the purposes for which we process your personal data and whether we can achieve
                    those purposes through other means, and the applicable legal, regulatory, tax, accounting or other
                    requirements.
                  </p>
                  <p>
                    By law we have to keep basic financial and transactional information about you for six years after you cease being our customer
                    for tax purposes. All other operational personal data (including staff records, documents, and compliance data) is retained for 90 days after subscription termination unless otherwise agreed.
                  </p>
                </div>
              </section>

              {/* Your Legal Rights */}
              <section>
                <h2 className="text-2xl font-bold">11. Your Legal Rights</h2>
                <div className="mt-4 space-y-6">
                  <p>You have the right to:</p>

                  <div>
                    <h3 className="text-xl font-semibold">11.1 Request Access</h3>
                    <p className="mt-2">
                      Request access to your personal data (commonly known as a "subject access request"). This enables
                      you to receive a copy of the personal data we hold about you and to check that we are lawfully
                      processing it.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.2 Request Correction</h3>
                    <p className="mt-2">
                      Request correction of the personal data that we hold about you. This enables you to have any
                      incomplete or inaccurate data we hold about you corrected, though we may need to verify the
                      accuracy of the new data you provide to us.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.3 Request Erasure</h3>
                    <p className="mt-2">
                      Request erasure of your personal data in certain circumstances. This enables you to ask us to
                      delete or remove personal data where there is no good reason for us continuing to process it. You
                      also have the right to ask us to delete or remove your personal data where you have successfully
                      exercised your right to object to processing (see below), where we may have processed your
                      information unlawfully or where we are required to erase your personal data to comply with local
                      law. Note, however, that we may not always be able to comply with your request of erasure for
                      specific legal reasons which will be notified to you, if applicable, at the time of your request.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.4 Object to Processing</h3>
                    <p className="mt-2">
                      Object to processing of your personal data where we are relying on a legitimate interest (or those
                      of a third party) as the legal basis for that particular use of your data (including carrying out
                      profiling based on our legitimate interests). In some cases, we may demonstrate that we have
                      compelling legitimate grounds to process your information which override your right to object.
                    </p>
                    <p className="mt-2">
                      You also have the absolute right to object any time to the processing of your personal data for
                      direct marketing purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.5 Request Data Transfer</h3>
                    <p className="mt-2">
                      Request the transfer of your personal data to you or to a third party. We will provide to you, or
                      a third party you have chosen, your personal data in a structured, commonly used, machine-readable
                      format. Note that this right only applies to automated information which you initially provided
                      consent for us to use or where we used the information to perform a contract with you.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.6 Withdraw Consent</h3>
                    <p className="mt-2">
                      Withdraw consent at any time where we are relying on consent to process your personal data.
                      However, this will not affect the lawfulness of any processing carried out before you withdraw
                      your consent. If you withdraw your consent, we may not be able to provide certain products or
                      services to you. We will advise you if this is the case at the time you withdraw your consent.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">11.7 Request Restriction of Processing</h3>
                    <p className="mt-2">
                      Request restriction of processing of your personal data. This enables you to ask us to suspend the
                      processing of your personal data in one of the following scenarios:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>If you want us to establish the data's accuracy</li>
                      <li>Where our use of the data is unlawful but you do not want us to erase it</li>
                      <li>
                        Where you need us to hold the data even if we no longer require it as you need it to establish,
                        exercise or defend legal claims
                      </li>
                      <li>
                        You have objected to our use of your data but we need to verify whether we have overriding
                        legitimate grounds to use it
                      </li>
                    </ul>
                  </div>

                  <p>If you wish to exercise any of the rights set out above, please see our contact details below.</p>
                </div>
              </section>

              {/* How to Contact Us */}
              <section>
                <h2 className="text-2xl font-bold">12. How to Contact Us</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    Please contact us if you have any questions about this Privacy Policy or the information we hold
                    about you. If you wish to contact us, please send an email to{" "}
                    <Link href="mailto:legal@heyed.co.uk" className="text-teal-500 hover:underline">
                      legal@heyed.co.uk
                    </Link>{" "}
                    or write to us at Hey Tech Labs Ltd, 128 City Road, London, EC1V 2NX or call us on +44 20 8044 9313.
                  </p>
                  <p>
                    If you wish to complain about any aspect of our processing of your personal data then please contact
                    us in the first instance. If we cannot resolve your complaint you have the right to complain to the
                    Information Commissioner at{" "}
                    <Link href="http://www.ico.org.uk" className="text-teal-500 hover:underline">
                      www.ico.org.uk
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* Changes to the Privacy Policy */}
              <section>
                <h2 className="text-2xl font-bold">13. Changes to the Privacy Policy</h2>
                <div className="mt-4">
                  <p>
                    We may change this Privacy Policy from time to time. You should check this policy occasionally to
                    ensure you are aware of the most recent version that will apply each time you access this website.
                  </p>
                </div>
              </section>
            </div>

            <hr className="my-8" />

            <footer className="not-prose">
              <p className="text-gray-600">
                By using HeyEd., you acknowledge that you have read, understood, and agree to be bound by this Privacy
                Policy.
              </p>
            </footer>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
