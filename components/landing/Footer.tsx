import { Github, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="flex h-16 items-center justify-between px-4">
      <p className="text-xs text-muted-foreground">
        {currentYear} Link1t. Built with <Heart className="w-3 h-3 inline fill-red-500 text-red-500" /> by{" "}
        <a
          href="https://github.com/Buddhsen-tripathi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:underline"
        >
          Buddhsen Tripathi
        </a>
      </p>
      <a
        href="https://github.com/Buddhsen-tripathi/link1t"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="w-4 h-4" />
      </a>
    </footer>
  )
}
