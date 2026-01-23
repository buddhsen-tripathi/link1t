"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Sun, Moon, ArrowUpRight } from "lucide-react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { isLoaded, isSignedIn } = useUser()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="h-16 flex items-center justify-between border-b border-dashed border-border px-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-serif text-xl font-semibold text-foreground">
          Link1t
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className={cn(
              "relative w-14 h-8 border border-border flex items-center px-1 transition-colors",
              theme === "dark" ? "justify-end" : "justify-start"
            )}
            aria-label="Toggle theme"
          >
            <div className="w-6 h-6 bg-foreground flex items-center justify-center">
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-background" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-background" />
              )}
            </div>
          </button>
        )}

        {/* Auth */}
        {!isLoaded ? (
          <div className="w-8 h-8 bg-muted animate-pulse" />
        ) : isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </button>
          </SignInButton>
        )}

        {/* CTA */}
        <Button asChild variant="secondary" size="sm" className="h-9 px-4 gap-1.5">
          <Link href="/generator">
            <span>Create</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground -rotate-0" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
