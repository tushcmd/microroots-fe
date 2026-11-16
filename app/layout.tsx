import type { Metadata, Viewport } from "next"
import { Geist, Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { Toaster } from "@/components/shared/toaster"
import { AnalyticsGate } from "@/components/site/analytics-gate"
import { CookieBanner } from "@/components/site/cookie-banner"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-geist-sans",
})

const inter = Inter({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "MicroRootsKe — Fresh microgreens, grown in Nairobi",
    template: "%s | MicroRootsKe",
  },
  description:
    "Cut-to-order microgreens and living trays grown in controlled Nairobi grow rooms, delivered fresh to kitchens and homes across the city.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
        <AnalyticsGate />
        <CookieBanner />
      </body>
    </html>
  )
}
