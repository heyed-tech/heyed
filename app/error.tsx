"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function Error({
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
    <Container className="min-h-[50vh] flex items-center justify-center py-16">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong!</h1>
          <p className="text-gray-500">We encountered an error while processing your request. Please try again.</p>
        </div>

        <Button onClick={reset} className="bg-teal-500 hover:bg-teal-600 gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </Container>
  )
}
