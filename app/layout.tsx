import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "EnglishLife - Build Your Career",
  description:
    "Join Uzbekistan's leading English education center. Explore open positions and grow your career with EnglishLife.",
}

export const viewport: Viewport = {
  themeColor: "#E11D48",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  )
}
