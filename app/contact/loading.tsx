import { Container } from "@/components/ui/container"
import { FormSkeleton } from "@/components/ui/form-skeleton"

export default function ContactLoading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mt-6 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-card border shadow-sm max-w-xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse mx-auto" />
          <div className="h-5 w-32 bg-muted rounded-md animate-pulse mx-auto" />
        </div>
        <FormSkeleton />
      </div>
    </Container>
  )
}
