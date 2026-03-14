"use client"

import Link from "next/link"
import { Instagram, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t-2 border-primary/20 bg-navy text-navy-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
            >
              <img
                src="/logo.png"
                alt="EnglishLife"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
              O'zbekistonning yetakchi ingliz tili ta'lim markazi. 2014-yildan beri sifatli ta'lim berib kelmoqdamiz.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Send, label: "Telegram", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-foreground/20 text-navy-foreground/70 transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-foreground/90">
              Karyera
            </p>
            <ul className="space-y-3">
              {[
                { label: "Vakansiyalar", href: "#vacancies" },
                { label: "Qadriyatlar", href: "#values" },
                { label: "Zahira ariza", href: "#zahira" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-navy-foreground/70 transition-all hover:translate-x-0.5 hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-navy-foreground/10 pt-8">
          <p className="text-center text-xs text-navy-foreground/50">
            &copy; {new Date().getFullYear()} EnglishLife.
          </p>
        </div>
      </div>
    </footer>
  )
}
