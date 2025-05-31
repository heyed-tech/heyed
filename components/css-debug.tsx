"use client"

import { useEffect } from "react"

export default function CSSDebug() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "production") {
      console.log("CSS Debug: Checking if styles are loaded")

      // Check if Tailwind styles are applied
      const hasTailwind =
        document.documentElement.classList.contains("font-sans") ||
        document.querySelectorAll('[class*="bg-"]').length > 0

      console.log("CSS Debug: Tailwind styles detected:", hasTailwind)

      // Check for custom fonts
      const fontFamilies = Array.from(document.querySelectorAll("*"))
        .map((el) => window.getComputedStyle(el).fontFamily)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)

      console.log("CSS Debug: Font families in use:", fontFamilies)
    }

    // This component doesn't render anything
    return () => {}
  }, [])

  return null
}
