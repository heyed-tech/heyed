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
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Building2, Users } from "lucide-react"
import { submitEnterpriseContact } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

interface ContactDialogProps {
  staffCount: number
  trigger?: React.ReactNode
}

export function ContactDialog({ staffCount, trigger }: ContactDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      await submitEnterpriseContact(formData)
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch with you shortly to discuss your requirements.",
      })
      setOpen(false)
      formRef.current?.reset()
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="default">Contact Sales</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enterprise Inquiry</DialogTitle>
          <DialogDescription>
            Tell us about your organisation and we&apos;ll get back to you with a custom solution.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Input id="name" name="name" placeholder="Your name" className="pl-9" required />
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input id="email" name="email" type="email" placeholder="your@email.com" className="pl-9" required />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <div className="relative">
              <Input id="phone" name="phone" type="tel" placeholder="Your phone number" className="pl-9" />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="staffCount">Number of Staff</Label>
            <div className="relative">
              <Input
                id="staffCount"
                name="staffCount"
                type="number"
                defaultValue={staffCount}
                className="pl-9"
                required
              />
              <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your requirements..."
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Send Inquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
