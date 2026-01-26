"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { ArrowUpRight, Star } from "lucide-react"
import { GeometricBackground } from "./GeometricBackground"

interface HeroProps {
  onOpenLogin: () => void
}

export function Hero({ onOpenLogin }: HeroProps) {
  const { isSignedIn, isLoaded } = useUser()
  const { resolvedTheme } = useTheme()

  return (
    <>
      <div className="relative flex h-[calc(100svh-64px-150px)] flex-row items-center overflow-hidden border-b border-dashed border-border">
        <GeometricBackground />
        <div className="z-10 flex flex-col gap-4">
          {/* Badges */}
          <div className="flex flex-col gap-3 px-6">
            <a
              href="https://peerlist.io/buddhsen/project/link1t--instant-portfolio-generator"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://peerlist.io/api/v1/projects/embed/PRJHR8DJN69OD66QJ2M8OE7BJB6A98?showUpvote=true&theme=${resolvedTheme === "dark" ? "dark" : "light"}`}
                alt="Link1t - Instant Portfolio Generator"
                className="h-15 w-auto"
              />
            </a>
            {/* <a
              href="https://github.com/Buddhsen-tripathi/link1t"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-7 w-fit items-center gap-2 border border-border bg-muted/20 px-2"
            >
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">Star</span>
            </a> */}
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-2 px-6 font-serif text-5xl md:text-6xl">
            <h1 className="text-muted-foreground">
              Create <span className="text-foreground">Beautiful</span> Portfolios
            </h1>
            <h2 className="text-muted-foreground">
              Not <span className="text-foreground">Boring</span> Ones
            </h2>
          </div>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-row gap-4 px-6">
            {isLoaded && isSignedIn ? (
              <Button asChild className="gap-2">
                <Link href="/dashboard">
                  <span>Edit Portfolio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button className="gap-2" onClick={onOpenLogin}>
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            )}
            <Button asChild variant="secondary" className="gap-2">
              <a
                href="https://github.com/Buddhsen-tripathi/link1t"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open Source</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="grid grid-flow-row sm:h-[150px] sm:grid-cols-3">
        <div className="flex h-40 flex-col gap-3 border-b border-dashed border-border p-4 sm:h-auto">
          <h3 className="font-medium text-foreground">Beautiful</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Professionally designed themes that make your work stand out to recruiters and clients.
          </p>
        </div>
        <div className="flex h-40 flex-col gap-3 border-b border-dashed border-border p-4 sm:h-auto sm:border-l">
          <h3 className="font-medium text-foreground">Free & Unlimited</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create as many portfolios as you need — no limits, no hidden costs, just share your link.
          </p>
        </div>
        <div className="flex h-40 flex-col gap-3 border-b border-dashed border-border p-4 sm:h-auto sm:border-l">
          <h3 className="font-medium text-foreground">AI-Powered</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Upload your resume and let AI extract your experience, skills, and projects automatically.
          </p>
        </div>
      </div>
    </>
  )
}
