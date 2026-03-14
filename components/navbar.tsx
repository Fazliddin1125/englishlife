"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Bosh sahifa", href: "/" },
  { label: "Qadriyatlar", href: "/#values" },
  { label: "Vakansiyalar", href: "/#vacancies" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link
            href="/"
            className="relative flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              src="/logo.png"
              alt="EnglishLife"
              className="h-9 w-auto object-contain lg:h-10"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:text-primary hover:bg-primary/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menyuni ochish"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-[min(320px,85vw)] border-l border-border bg-background/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-lg font-bold text-foreground">Menyu</span>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav key={String(mobileOpen)} className="flex flex-col gap-1 px-3 py-4">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="slide-in-right rounded-xl px-4 py-3.5 text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary"
              style={{ animationDelay: `${(i + 1) * 60}ms` }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
