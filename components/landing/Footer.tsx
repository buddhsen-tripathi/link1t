import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background">
      <div className="container px-6 md:px-8 max-w-6xl mx-auto py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground">
              Link1t
            </Link>
            <span className="text-sm text-muted-foreground">
              Open source portfolio generator
            </span>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/generator" className="hover:text-foreground transition-colors">
              Generator
            </Link>
            <Link href="/examples" className="hover:text-foreground transition-colors">
              Examples
            </Link>
            <a
              href="https://github.com/Buddhsen-tripathi/link1t"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="border-t border-dashed border-border mt-8 pt-8">
          <p className="text-xs text-muted-foreground text-center">
            {currentYear} Link1t. Built by{" "}
            <a
              href="https://github.com/Buddhsen-tripathi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Buddhsen Tripathi
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
