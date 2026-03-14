"use client"

import { useEffect, useState } from "react"
import { Heart, Users, Rocket, Award, BookOpen, Globe } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const values = [
  {
    icon: Heart,
    title: "O‘qitishga ishtiyoq",
    description:
      "Talabalarimizni g‘ayratli va o‘z ishiga sadoqatli o‘qituvchilar orqali ilhomlantirishga ishonamiz.",
  },
  {
    icon: Users,
    title: "Hamkorlik madaniyati",
    description:
      "Bir-birini qo‘llab-quvvatlovchi va o‘rganuvchi iqtidorli mutaxassislar bilan birga ishlang.",
  },
  {
    icon: Rocket,
    title: "Karyera rivoji",
    description:
      "Doimiy o‘qitish va rivojlanish dasturlari bilan aniq martaba yo‘llari.",
  },
  {
    icon: Award,
    title: "E‘tirof va mukofotlar",
    description:
      "Raqobatbardosh ish haqi, bonuslar va a‘lo ishlar uchun e‘tirof.",
  },
  {
    icon: BookOpen,
    title: "Zamonaviy metodika",
    description:
      "Eng yangi o‘qitish resurslari va Kembrij sertifikatlangan o‘quv dasturi.",
  },
  {
    icon: Globe,
    title: "Ta'sir va maqsad",
    description:
      "Minglab talabalarga chet elda o‘qish va ishlash orzularini amalga oshirishda yordam bering.",
  },
]

export function CompanyValues() {
  const { ref, isInView } = useInView({ threshold: 0.08 })
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (isInView && !visible) setVisible(true)
  }, [isInView, visible])

  return (
    <section
      id="values"
      ref={ref}
      className="relative bg-gradient-to-b from-background via-background to-secondary/20 section-padding"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className={cn("mx-auto max-w-2xl text-center", visible && "in-view")}>
          <p
            className="reveal text-sm font-semibold uppercase tracking-wider text-primary"
            style={{ transitionDelay: "0ms" }}
          >
            Nima uchun biz?
          </p>
          <h2
            className="reveal mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ transitionDelay: "80ms" }}
          >
            Qadriyatlarimiz va madaniyat
          </h2>
          <p
            className="reveal mt-4 text-pretty text-muted-foreground"
            style={{ transitionDelay: "160ms" }}
          >
            EnglishLife jamoadoshlarimizga sarmoya kiritamiz. Karyerangizni qura olish uchun
            bizni ajoyib qiladigan narsalarni bilib oling.
          </p>
        </div>

        <div className={cn("mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", visible && "in-view")}>
          {values.map((value, i) => (
            <div
              key={value.title}
              className="reveal group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20"
              style={{ transitionDelay: `${220 + i * 70}ms` }}
            >
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
