import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display, Great_Vibes } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
})

export const metadata: Metadata = {
  title: "Ben Lux Nails - Luxury Nail Salon",
  description:
    "Your city's high end, natural nail salon dedicated to bringing clients the very best in natural nail beauty and care.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${greatVibes.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
