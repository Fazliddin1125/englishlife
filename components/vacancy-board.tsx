"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Clock,
  ChevronRight,
  ChevronDown,
  Users,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBranchById, getJobTitleById } from "@/lib/store"
import { IVacancy } from "@/types"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const tagColors: Record<string, string> = {
  TEACHING: "bg-primary/10 text-primary",
  MANAGEMENT: "bg-amber-100 text-amber-700",
  SALES: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-sky-100 text-sky-700",
  REMOTE: "bg-violet-100 text-violet-700",
}

function getCategoryTag(jobTitleName: string): { label: string; color: string } {
  const n = jobTitleName.toLowerCase()
  if (n.includes("teacher") || n.includes("instructor") || n.includes("tutor"))
    return { label: "TEACHING", color: tagColors.TEACHING }
  if (n.includes("manager"))
    return { label: "MANAGEMENT", color: tagColors.MANAGEMENT }
  if (n.includes("consultant"))
    return { label: "SALES", color: tagColors.SALES }
  if (n.includes("admin") || n.includes("receptionist"))
    return { label: "ADMIN", color: tagColors.ADMIN }
  return { label: "GENERAL", color: tagColors.TEACHING }
}

function getEmploymentBadge(jobTitleName: string): { label: string; color: string } {
  const n = jobTitleName.toLowerCase()
  if (n.includes("remote"))
    return { label: "REMOTE", color: tagColors.REMOTE }
  if (n.includes("part"))
    return { label: "PART-TIME", color: tagColors.SALES }
  return { label: "FULL-TIME", color: "bg-primary text-primary-foreground" }
}

type VacancyBoardProps = {
  vacancies: IVacancy[]
}

export function VacancyBoard({ vacancies }: VacancyBoardProps) {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.08 })
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (isInView && !visible) setVisible(true)
  }, [isInView, visible])

  return (
    <section id="vacancies" ref={sectionRef} className="relative bg-gradient-to-b from-secondary/30 via-background to-background section-padding">
      <div className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 lg:px-8", visible && "in-view")}>
        <div className="reveal" style={{ transitionDelay: "0ms" }}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bo'sh ish o'rinlari
          </h2>
          <p className="mt-2 text-muted-foreground">
            EnglishLife jamoasida o'z o'rningizni toping
          </p>
        </div>
      </div>

      <div className={cn("mx-auto max-w-7xl px-4 py-10 lg:px-8", visible && "in-view")}>
        {vacancies.length === 0 ? (
          <div className="reveal flex flex-col items-center py-20 text-center" style={{ transitionDelay: "100ms" }}>
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-9 w-9 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">
              Hozirda aktiv vakansiya yo'q
            </p>
            <p className="mt-2 max-w-md text-muted-foreground">
              Hozircha bo'sh ish o'rinlari mavjud emas. Zahira uchun ariza qoldiring — yangi vakansiya ochilganda siz bilan bog'lanamiz.
            </p>
            <a href="#zahira" className="mt-6 group">
              <Button variant="outline" className="gap-2 rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white">
                Zahira uchun ariza qoldirish
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((vacancy, idx) => {
              let branchName = ""
              let jobName = ""

              if (typeof vacancy.branch === "string") {
                const br = getBranchById(vacancy.branch)
                branchName = br?.name || ""
              } else if (vacancy.branch) {
                branchName = (vacancy.branch as any).name || ""
              }

              if (typeof vacancy.job === "string") {
                const jt = getJobTitleById(vacancy.job)
                jobName = jt?.name || ""
              } else if (vacancy.job) {
                jobName = (vacancy.job as any).name || ""
              }

              const cat = jobName ? getCategoryTag(jobName) : null
              const emp = jobName ? getEmploymentBadge(jobName) : null
              return (
                <div
                  key={vacancy._id}
                  className="reveal group flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10"
                  style={{ transitionDelay: `${120 + idx * 50}ms` }}
                >
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {cat && (
                        <span
                          className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${cat.color}`}
                        >
                          {vacancy.online ? "MASOFADAN" : "OFLINE"}
                        </span>
                      )}
                      {emp && (
                        <span
                          className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${emp.color}`}
                        >
                          {vacancy.parttime ? "Qisman stavka" : "To'liq kun"}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {vacancy.title}
                    </h3>

                    <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {vacancy.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {!vacancy.parttime ? "Erkin grafik" : "To'liq ish kuni"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {branchName ? `${branchName} filial` : "Noma'lum filial"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {vacancy.online ? "Masofadan" : "Ofisda"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border px-6 py-4">
                    <Link href={`/vacancy/${vacancy._id}`}>
                      <Button className="w-full gap-2 rounded-full">
                        Batafsil
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
