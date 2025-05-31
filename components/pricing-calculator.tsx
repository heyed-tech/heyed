"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Check,
  Phone,
  Users,
  Rocket,
  TrendingUp,
  Building2,
  Zap,
  Crown,
  Star,
  Timer,
  Shield,
  BarChart,
} from "lucide-react"
import { AnimatedNumber } from "./animated-number"
import { EnterpriseContact } from "@/components/enterprise-contact"
import { cn } from "@/lib/utils"
import { RegisterInterestDialog } from "@/components/register-interest-dialog"

export default function PricingCalculator() {
  const [staffCount, setStaffCount] = React.useState(10)

  const PRICING_TIERS = {
    STARTER: {
      name: "Starter",
      maxStaff: 10,
      basePrice: 15,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      lightColor: "bg-teal-50",
      icon: Rocket,
      description: "Perfect for small teams",
    },
    GROWTH: {
      name: "Growth",
      maxStaff: 30,
      basePrice: 25,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      lightColor: "bg-indigo-50",
      icon: TrendingUp,
      description: "Ideal for growing organisations",
    },
    PRO: {
      name: "Pro",
      maxStaff: 60,
      basePrice: 35,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      lightColor: "bg-blue-50",
      icon: Building2,
      description: "For larger teams",
    },
    SCALE: {
      name: "Scale",
      maxStaff: 99,
      basePrice: 50,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      lightColor: "bg-purple-50",
      icon: TrendingUp,
      description: "For scaling organisations",
    },
    ENTERPRISE: {
      name: "Enterprise",
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
      lightColor: "bg-amber-50",
      icon: Crown,
      description: "Custom solution for enterprise organisations",
    },
  }

  const ADMIN_HOURLY_RATE = 14
  const HOURS_PER_STAFF_MONTHLY = 0.25 // 15 minutes per staff member

  const features = [
    {
      icon: Shield,
      text: "Never miss a renewal again",
      color: "text-green-500",
    },
    {
      icon: Timer,
      text: "Save hours on administrative tasks",
      color: "text-blue-500",
    },
    {
      icon: Star,
      text: "Easily maintain Ofsted compliance",
      color: "text-purple-500",
    },
    {
      icon: Check,
      text: "Automate document verification",
      color: "text-teal-500",
    },
    {
      icon: BarChart,
      text: "Real-time compliance tracking",
      color: "text-indigo-500",
    },
    {
      icon: Zap,
      text: "Instant staff record access",
      color: "text-orange-500",
    },
  ]

  const calculatePrice = (count: number) => {
    if (count <= PRICING_TIERS.STARTER.maxStaff) {
      return PRICING_TIERS.STARTER.basePrice
    } else if (count <= PRICING_TIERS.GROWTH.maxStaff) {
      return PRICING_TIERS.GROWTH.basePrice
    } else if (count <= PRICING_TIERS.PRO.maxStaff) {
      return PRICING_TIERS.PRO.basePrice
    } else if (count <= PRICING_TIERS.SCALE.maxStaff) {
      return PRICING_TIERS.SCALE.basePrice
    }
    return null // Enterprise tier
  }

  const getCurrentTier = (count: number) => {
    if (count <= PRICING_TIERS.STARTER.maxStaff) {
      return PRICING_TIERS.STARTER
    } else if (count <= PRICING_TIERS.GROWTH.maxStaff) {
      return PRICING_TIERS.GROWTH
    } else if (count <= PRICING_TIERS.PRO.maxStaff) {
      return PRICING_TIERS.PRO
    } else if (count <= PRICING_TIERS.SCALE.maxStaff) {
      return PRICING_TIERS.SCALE
    }
    return { ...PRICING_TIERS.ENTERPRISE, maxStaff: Number.POSITIVE_INFINITY, basePrice: null }
  }

  const totalPrice = calculatePrice(staffCount)
  const currentTier = getCurrentTier(staffCount)

  // Calculate admin time
  const monthlyAdminHours = staffCount * HOURS_PER_STAFF_MONTHLY
  const monthlyAdminCost = monthlyAdminHours * ADMIN_HOURLY_RATE

  // Calculate ROI
  const yearlyCost = totalPrice ? totalPrice * 12 : 0
  const yearlySavings = monthlyAdminCost * 12
  const netSavings = yearlySavings - yearlyCost
  const roi = yearlyCost > 0 ? (netSavings / yearlyCost) * 100 : 0

  // Display staff count with "+" when it reaches 100
  const displayStaffCount = staffCount === 100 ? "100+" : staffCount

  // Get the correct slider thumb color based on the current tier
  const getSliderThumbColor = () => {
    switch (currentTier.name) {
      case "Starter":
        return "#14b8a6" // teal-500
      case "Growth":
        return "#6366f1" // indigo-500
      case "Pro":
        return "#3b82f6" // blue-500
      case "Scale":
        return "#a855f7" // purple-500
      default:
        return "#f59e0b" // amber-500 for Enterprise
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-[20px]">
      <CardHeader className="text-center border-b px-4 sm:px-6 py-6">
        <CardTitle className="text-xl sm:text-2xl font-bold mb-2">Pricing Calculator</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Adjust the slider to see your monthly price. For larger teams, we'll create a custom Enterprise plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6 sm:p-8">
        {/* Slider Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <label className="font-medium text-sm sm:text-base">Number of Staff Members: {displayStaffCount}</label>
            <motion.div
              className={cn("text-xl sm:text-2xl font-bold", currentTier.color.replace("bg-", "text-"))}
              layout
            >
              {totalPrice ? (
                <>
                  <AnimatedNumber
                    value={totalPrice}
                    formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                </>
              ) : (
                <span className="text-xl font-bold">Contact Us</span>
              )}
            </motion.div>
          </div>

          <div className="relative">
            <input
              type="range"
              min="1"
              max="100"
              value={staffCount}
              onChange={(e) => setStaffCount(Number.parseInt(e.target.value))}
              className={cn("w-full h-2 rounded-full appearance-none cursor-pointer", currentTier.lightColor)}
              style={
                {
                  "--slider-thumb-color": getSliderThumbColor(),
                } as React.CSSProperties
              }
            />
            <div className="mt-2 text-center">
              <span
                className={cn(
                  "inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full",
                  currentTier.lightColor,
                  currentTier.color.replace("bg-", "text-"),
                )}
              >
                <currentTier.icon className="h-3.5 w-3.5" />
                {currentTier.description}
              </span>
            </div>
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>1</span>
            <span>30</span>
            <span>60</span>
            <span>100+</span>
          </div>
        </div>

        {/* Current Plan Section */}
        <div
          className={cn(
            "p-6 rounded-card",
            currentTier.lightColor,
            "border border-transparent transition-colors duration-300",
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("p-2 rounded-full", currentTier.color, "text-white")}>
              <currentTier.icon className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-base">Current Plan: {currentTier.name}</h4>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Monthly Price</div>
                <div className="font-inter tabular-nums tracking-tight text-lg">
                  {totalPrice ? (
                    <>
                      <AnimatedNumber
                        value={totalPrice}
                        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Contact Us</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Staff Limit</div>
                <div className="font-inter tabular-nums tracking-tight text-lg">
                  {currentTier.maxStaff < Number.POSITIVE_INFINITY ? (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{`Up to ${currentTier.maxStaff}`}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      <span>100+ staff profiles</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {totalPrice ? (
          <>
            {/* Admin Time Estimate */}
            <div className="p-6 rounded-card bg-gradient-to-br from-gray-50 to-white border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-orange-500 text-white">
                  <Timer className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-base">Estimated Admin Time</h4>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Monthly Admin Hours</div>
                    <div className="font-inter tabular-nums tracking-tight text-lg">
                      <AnimatedNumber
                        value={monthlyAdminHours}
                        formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                        showCurrency={false}
                      />
                      <span className="text-sm text-gray-500 ml-1">hours</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Monthly Admin Cost</div>
                    <div className="font-inter tabular-nums tracking-tight text-lg text-gray-900">
                      <AnimatedNumber
                        value={monthlyAdminCost}
                        showCurrency
                        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  * This is an estimate based on approximately 15 minutes of admin time per staff member per month at
                  £14/hour. Actual time and costs may vary depending on your specific requirements and processes.
                </div>
              </div>
            </div>

            {/* ROI Section */}
            <div className="p-6 rounded-card bg-gradient-to-br from-emerald-50 to-white border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-emerald-500 text-white">
                  <BarChart className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-base">Return on Investment</h4>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Yearly Platform Cost</div>
                      <div className="font-inter tabular-nums tracking-tight text-lg">
                        <AnimatedNumber
                          value={yearlyCost}
                          showCurrency
                          formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Yearly Admin Cost Savings</div>
                      <div className="font-inter tabular-nums tracking-tight text-lg text-emerald-600">
                        <AnimatedNumber
                          value={yearlySavings}
                          showCurrency
                          formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Potential Yearly Savings</div>
                        <div className="font-inter tabular-nums tracking-tight text-xl font-bold text-emerald-600">
                          <AnimatedNumber
                            value={netSavings}
                            showCurrency
                            formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">ROI</div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                          <motion.div
                            className="font-inter tabular-nums tracking-tight text-xl font-bold text-emerald-600"
                            layout
                          >
                            {roi.toFixed(0)}%
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, roi)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EnterpriseContact
            staffCount={staffCount}
            className="p-6 rounded-card bg-gradient-to-br from-indigo-50 to-white border"
          />
        )}

        {/* Features Section */}
        <div>
          <h4 className="font-semibold text-sm sm:text-base mb-4">Benefits:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border transition-all duration-200 hover:shadow-md"
              >
                <feature.icon className={cn("h-4 w-4", feature.color)} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {totalPrice && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <RegisterInterestDialog
              trigger={<Button className="w-full">Get Started</Button>}
              defaultStaffCount={staffCount}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
