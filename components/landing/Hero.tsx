"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { ArrowUpRight, Star } from "lucide-react"

export function Hero() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="container px-6 md:px-8 max-w-4xl mx-auto py-16">
          {/* Content with grid layout */}
          <div className="border border-border" style={{ borderStyle: 'dashed' }}>
            {/* Top row - label and badge */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border" style={{ borderStyle: 'dashed' }}>
              <div className="flex items-center gap-4">
                <div className="h-px w-6 bg-border" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Portfolio Generator
                </span>
              </div>
              <a
                href="https://github.com/Buddhsen-tripathi/link1t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>Star on GitHub</span>
              </a>
            </div>

            {/* Main content row */}
            <div className="px-8 py-16 md:px-12 md:py-24 border-b border-border" style={{ borderStyle: 'dashed' }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.1] mb-8">
                <span className="text-muted-foreground">Create</span>{" "}
                <span className="text-foreground">Beautiful</span>{" "}
                <span className="text-muted-foreground">Portfolios</span>
                <br />
                <span className="text-muted-foreground">Not</span>{" "}
                <span className="text-foreground">Boring</span>{" "}
                <span className="text-muted-foreground">Ones</span>
              </h1>

              <Button asChild size="lg" className="h-11 px-6 gap-2">
                <Link href="/generator">
                  {isLoaded && isSignedIn ? "Edit Portfolio" : "Get Started"}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Features row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="px-8 py-8 md:border-r border-border" style={{ borderStyle: 'dashed' }}>
                <h3 className="font-medium text-foreground mb-3">Beautiful</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Professionally designed themes that make your work stand out.
                </p>
              </div>
              <div className="px-8 py-8 border-t md:border-t-0 md:border-r border-border" style={{ borderStyle: 'dashed' }}>
                <h3 className="font-medium text-foreground mb-3">Free & Unlimited</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No limits, no hidden costs. Just share your link.
                </p>
              </div>
              <div className="px-8 py-8 border-t md:border-t-0">
                <h3 className="font-medium text-foreground mb-3">AI-Powered</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload your resume and let AI do the rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
