"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function ContactError({
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
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Contact Form Error</h2>
        <p className="text-gray-500 mb-6">
          We encountered an error while processing your contact form. Please try again or contact us directly at{" "}
          <a href="mailto:support@heyed.co.uk" className="text-teal-500 hover:underline">
            support@heyed.co.uk
          </a>
          .
        </p>
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </Container>
  )
}
