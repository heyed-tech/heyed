import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <Container className="!max-w-4xl">
        <div className="flex flex-col gap-6 py-8 md:py-12 mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Link href="/" className="flex items-center ml-3.5">
              <Logo />
            </Link>
            <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 text-center">
              <Link href="/ask-ed" className="text-sm font-medium hover:underline underline-offset-4">
                AskEd.
              </Link>
              <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm font-medium hover:underline underline-offset-4">
                Cookies Policy
              </Link>
              <Link href="/dpa" className="text-sm font-medium hover:underline underline-offset-4">
                DPA
              </Link>
              <Link href="/terms" className="text-sm font-medium hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
                Contact Us
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} HeyEd. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61568198237207"
                className="text-gray-500 hover:text-teal-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link href="https://x.com/oh_hey_ed" className="text-gray-500 hover:text-teal-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/heyed/?viewAsMember=true"
                className="text-gray-500 hover:text-teal-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
