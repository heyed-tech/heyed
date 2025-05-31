"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building2, Mail, Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { registerInterest } from "@/app/actions"

interface RegisterInterestDialogProps {
  trigger: React.ReactNode
  defaultStaffCount?: number
  defaultInterest?: string
}

export function RegisterInterestDialog({
  trigger,
  defaultStaffCount = 10,
  defaultInterest = "trial",
}: RegisterInterestDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      const result = await registerInterest(formData)

      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Thank you for your interest. We'll be in touch shortly.",
        })
        setOpen(false)
        formRef.current?.reset()
      } else {
        console.error("Registration failed:", result.error)
        toast({
          title: "Registration failed",
          description: result.error || "Please try again later or contact us directly.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Something went wrong",
        description: "Failed to register interest. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[475px] !rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Coming Soon! 🚀</DialogTitle>
          <DialogDescription>
            HeyEd is coming soon! Register your interest to be notified when we launch.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={onSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Input id="name" name="name" placeholder="Your name" className="pl-9 bg-gray-50" required />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <div className="relative">
              <Input id="company" name="company" placeholder="Your company name" className="pl-9 bg-gray-50" required />
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="pl-9 bg-gray-50"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Input id="phone" name="phone" type="tel" placeholder="Your phone number" className="pl-9 bg-gray-50" />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <input type="hidden" name="staffCount" value={defaultStaffCount} />
          <input type="hidden" name="interest" value={defaultInterest} />
          <Button type="submit" disabled={isPending} className="w-full bg-teal-500 hover:bg-teal-600">
            {isPending ? "Submitting..." : "Register Interest"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
