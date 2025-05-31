import { Container } from "@/components/ui/container"
import { Logo } from "@/components/logo"
import { UCheckLogo } from "@/components/ucheck-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { CheckCircle2, X } from "lucide-react"

export default function ComparisonPage() {
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

        <Container className="py-8 md:py-12 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-teal-100 p-1">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
              </div>
              <h1 className="text-2xl font-bold md:text-3xl">Feature & Pricing Comparison (1–50 Checks)</h1>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-[20px] bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 overflow-hidden">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-semibold bg-gray-50/80 first:rounded-tl-[20px]">
                      Feature / Service
                    </th>
                    <th className="p-4 text-left font-semibold bg-gray-50/80">
                      <div className="w-32 flex items-center">
                        <Logo />
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold bg-gray-50/80">
                      <div className="w-32 flex items-center">
                        <UCheckLogo />
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold bg-gray-50/80 last:rounded-tr-[20px]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Right to Work Check</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>Included in RTW Plus</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£10.20</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">uCheck covers UK/Irish only</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Digital ID Verification (IDVT)</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>Included in RTW Plus</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£5.60</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">uCheck charges separately</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">RTW Plus (UK + Non-UK)</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£6.00 (all-in-one)</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500" />
                        <span>Not supported</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">HeyEd supports share codes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Enhanced DBS (1–50 checks)</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£68.50</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£78.24</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">Both include gov't fee</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Total RTW + IDVT + DBS</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>£74.50</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500" />
                        <span>£94.04</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">HeyEd saves £19.54 per check</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Setup Fee</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>No setup fee</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500" />
                        <span>£58.80</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">HeyEd is zero-cost to start</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">SCR Auto-Reconciliation</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>Automatic</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500" />
                        <span>Manual export/upload</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">HeyEd syncs to central record</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium first:rounded-bl-[20px]">All Checks in One Provider</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        <span>Yes</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5 text-red-500" />
                        <span>No (split services)</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 last:rounded-br-[20px]">HeyEd is a single vendor solution</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
