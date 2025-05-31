"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface AnimatedNumberProps {
  value: number
  formatOptions?: Intl.NumberFormatOptions
  className?: string
  showCurrency?: boolean
}

export function AnimatedNumber({ value, formatOptions, className, showCurrency = true }: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)

  useEffect(() => {
    const animation = animate(motionValue, value, {
      duration: 0.5,
      ease: "easeOut",
    })

    return animation.stop
  }, [value, motionValue])

  const displayValue = useTransform(motionValue, (current) => {
    const formattedNumber = new Intl.NumberFormat("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...formatOptions,
    }).format(current)

    return showCurrency ? `£${formattedNumber}` : formattedNumber
  })

  return <motion.span className={className}>{displayValue}</motion.span>
}
