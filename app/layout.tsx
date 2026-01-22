import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Amiko, Adamina, Chivo_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const amiko = Amiko({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-amiko",
});

const adamina = Adamina({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-adamina",
});

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo-mono",
});

export const metadata: Metadata = {
  title: "Link1t - Portfolio Generator",
  description:
    "Create a professional developer portfolio. Add your details once, preview multiple themes, share one link.",
  keywords: ["portfolio", "developer", "resume", "AI", "generator", "career"],
  authors: [{ name: "Buddhsen Tripathi" }],
  openGraph: {
    title: "Link1t - Portfolio Generator",
    description: "Create a professional developer portfolio. Add your details once, preview multiple themes, share one link.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${amiko.variable} ${adamina.variable} ${chivoMono.variable}`}>
      <body className="font-sans antialiased">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "4fac4de58213481d98a2e09057316c38"}'></script>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
