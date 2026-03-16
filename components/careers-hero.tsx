"use client"

import Link from "next/link"
import { Briefcase, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionDivider } from "@/components/section-divider"

export function CareersHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-primary">
      {/* Animated gradient orbs (mesh) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-[100px] animate-blob"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute -right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-primary-foreground/10 blur-[90px] animate-blob"
          style={{ animationDelay: "-2s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary-foreground/5 blur-[80px] animate-blob"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-24 pb-32 text-center lg:px-8">
        {/* Badge */}


        {/* Headline with staggered reveal */}
        <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          <span className="block animate-text-reveal opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
            English Life
          </span>
          <span className="mt-2 block animate-text-reveal opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
            jamoasiga qo‘shiling
          </span>
        </h1>

        <p
          className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 animate-fade-in-up opacity-0 [animation-delay:0.7s] [animation-fill-mode:forwards] sm:text-xl"
          style={{ animationDelay: "0.7s" }}
        >
          11 yillik tajriba va 11 ta filial — biz bilan nafaqat o‘quvchilar, balki mutaxassislar ham o‘sadi. 
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up opacity-0 [animation-delay:0.9s] [animation-fill-mode:forwards]">
          <Link href="/#vacancies">
            <Button
              size="lg"
              className="group gap-2 rounded-full bg-white px-8 text-primary shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl"
            >
              <Briefcase className="h-5 w-5" />
              Vakansiyalarni ko‘rish
            </Button>
          </Link>
          <Link href="/#zahira">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full border-2 border-white/50 bg-transparent px-8 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white hover:bg-white/10"
            >
              Zahira uchun ariza
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <a
          href="/#values"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/70 transition-colors hover:text-white"
          aria-label="Pastga o‘tish"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Pastga</span>
          <ChevronDown className="h-6 w-6 animate-bounce-soft" />
        </a>
      </div>

      <SectionDivider flip />
    </section>
  )
}
