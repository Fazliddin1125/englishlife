import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const siteUrl = "https://englishlifehr.uz"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EnglishLife HR – Ish o‘rinlari va karyera imkoniyatlari",
    template: "%s | EnglishLife HR",
  },
  description:
    "EnglishLife HR – ingliz tili ta’lim tarmog‘idagi bo‘sh ish o‘rinlari, o‘qituvchi va stafflar uchun karyera imkoniyatlari. Vakansiyalarni ko‘ring va zahira uchun ariza qoldiring.",
  keywords: [
    "EnglishLife HR",
    "EnglishLife ish o‘rinlari",
    "ingliz tili o‘qituvchisi ish",
    "o‘qituvchi vakansiya",
    "ingliz tili kursi ish",
    "karyera EnglishLife",
    "English Life HR",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "EnglishLife HR – Ingliz tili o‘qituvchilari uchun ish o‘rinlari",
    description:
      "EnglishLife tarmoqlarida ishlashni istagan o‘qituvchi va mutaxassislar uchun yagona karyera portali. Aktual vakansiyalar va zahira arizalar.",
    siteName: "EnglishLife HR",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "EnglishLife HR – karyera portali",
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
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
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
