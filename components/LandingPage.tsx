import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 xl:py-56 relative overflow-hidden flex justify-center items-center">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10" />
          
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Next Generation Platform</span>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                Build Faster, Scale Smarter
              </h1>
              
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                The ultimate toolkit for modern development. Everything you need to launch your next big idea, all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold group rounded-full bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
