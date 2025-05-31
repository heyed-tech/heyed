"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/logo"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="border-b bg-white">
            <Container>
              <div className="flex h-16 items-center">
                <Logo />
              </div>
            </Container>
          </header>
          <main className="py-16 md:py-24">
            <Container>
              <div className="mx-auto max-w-lg text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Something went wrong!</h1>
                  <p className="text-gray-500">
                    We encountered an error while processing your request. Please try again.
                  </p>
                </div>

                <Button onClick={reset} className="bg-teal-500 hover:bg-teal-600 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            </Container>
          </main>
        </div>
      </body>
    </html>
  )
}
