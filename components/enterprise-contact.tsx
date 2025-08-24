"use client"

import * as React from "react"
import { Building2, Mail, Phone, Users, User, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { submitEnterpriseContact } from "@/app/actions"

interface EnterpriseContactProps {
  staffCount: number
  className?: string
}

export function EnterpriseContact({ staffCount, className }: EnterpriseContactProps) {
  const [isPending, setIsPending] = React.useState(false)
  const [count, setCount] = React.useState(staffCount)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      const result = await submitEnterpriseContact(formData)
      
      if (result.success) {
        toast({
          title: "Thanks for your interest!",
          description: "We'll be in touch with you shortly to discuss your requirements.",
        })
        formRef.current?.reset()
        setCount(staffCount) // Reset counter to initial value
      } else {
        throw new Error(result.error || "Failed to submit enterprise contact form")
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const increment = () => setCount((prev) => Math.min(999, prev + 1))
  const decrement = () => setCount((prev) => Math.max(1, prev - 1))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      setCount(Math.max(1, Math.min(999, value)))
    }
  }

  return (
    <div className={cn(className, "bg-gradient-to-br from-gray-50 via-gray-100/30 to-white border-gray-200 border")}>
      <div className="mb-6 space-y-2">
        <h3 className="text-lg font-semibold">Enterprise Plan</h3>
        <p className="text-sm text-gray-500">
          Perfect for larger organisations with custom requirements. Get in touch with our team for a tailored solution.
        </p>
      </div>

      <form ref={formRef} action={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Input id="name" name="name" placeholder="Your name" className="pl-9 rounded-xl" required />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <div className="relative">
            <Input id="company" name="company" placeholder="Your company name" className="pl-9 rounded-xl" required />
            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="pl-9 rounded-xl"
              required
            />
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Input id="phone" name="phone" type="tel" placeholder="Your phone number" className="pl-9 rounded-xl" />
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="staffCount">Number of Staff</Label>
          <div className="relative flex items-center">
            <Input
              id="staffCount"
              name="staffCount"
              type="number"
              value={count}
              onChange={handleChange}
              className="pl-9 pr-16 rounded-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
            <Users className="absolute left-3 top-2.5 h-4 w-4 text-teal-500" />
            <div className="absolute right-1 top-1 bottom-1 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={increment}
                className="flex h-1/2 w-8 items-center justify-center rounded-t-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200"
                aria-label="Increase number of staff"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={decrement}
                className="flex h-1/2 w-8 items-center justify-center rounded-b-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200"
                aria-label="Decrease number of staff"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
          {isPending ? "Sending..." : "Send Inquiry"}
        </Button>
      </form>
    </div>
  )
}
