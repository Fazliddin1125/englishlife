"use client"

import { useEffect, useState } from "react"
import { Heart, Users, Rocket, Award, BookOpen, Globe } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const values = [
  {
    icon: Heart,
    title: "Ishga mehr",
    description:
      "Dars o‘tishni shunchaki vazifa emas, bolalar bilan til topishish deb bilamiz. O‘quvchingiz yutug‘idan quvonsangiz — biz bilan bittasiz.",
  },
  {
    icon: Users,
    title: "Kuchli jamoa",
    description:
      "Bizda \"har kim o‘zi uchun\" degan gap yo‘q. Qiyin mavzuda to‘xtab qolsangiz yoki yangi g‘oya kelmasa, jamoa har doim yoningizda.",
  },
  {
    icon: Rocket,
    title: "O‘sish imkoniyati",
    description:
      "Bir joyda qolib ketmaysiz. Bugungi o‘qituvchimiz ertaga metodist yoki filial rahbari bo‘lishi biz uchun odatiy hol.",
  },
  {
    icon: Award,
    title: "Mehnat qadri",
    description:
      "Yaxshi natija e’tiborsiz qolmaydi. Barqaror maoshdan tashqari, jamoaviy sayohatlar va shaxsiy bonuslar tizimi aniq yo‘lga qo‘yilgan.",
  },
  {
    icon: BookOpen,
    title: "Tayyor tizim",
    description:
      "Darsni qanday o‘tish bo‘yicha samarali metodikamiz bor. Ortiqcha qog‘ozbozlik emas, bor e’tiboringizni dars sifatiga qaratasiz.",
  },
  {
    icon: Globe,
    title: "Katta maqsad",
    description:
      "Biz shunchaki til o‘rgatmaymiz, yoshlarga dunyo eshiklarini ochamiz. Sizning darsingiz — kimningdir ushalgan orzusi demakdir.",
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
      <div className="mx-auto max-w-7xl px-4  lg:px-8">
        <div className={cn("mx-auto max-w-3xl text-center", visible && "in-view")}>
          <p
            className="reveal text-sm font-semibold uppercase tracking-wider text-primary"
            style={{ transitionDelay: "0ms" }}
          >
            Nima uchun biz?
          </p>
          <h2
            className="reveal  mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ transitionDelay: "80ms" }}
          >
            Qadriyatlarimiz va madaniyatimiz
          </h2>
          <p
            className="reveal mt-4 text-pretty text-muted-foreground"
            style={{ transitionDelay: "160ms" }}
          >
            Karyerangizni qura olish uchun
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
