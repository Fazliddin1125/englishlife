"use client"

import React, { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  MapPin,
  Clock,
  ChevronRight,
  Search,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBranchById, getJobTitleById } from "@/lib/store"
import { IVacancy } from "@/types"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

/* ---- Tag color map ---- */
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

/* ---- Main Board ---- */
type VacancyBoardProps = {
  vacancies: IVacancy[]
}
export function VacancyBoard({ vacancies }: VacancyBoardProps) {
  const activeVacancies = vacancies
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.08 })
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (isInView && !visible) setVisible(true)
  }, [isInView, visible])

  const allBranches = useMemo(() => {
    const map = new Map<string, string>()
    activeVacancies.forEach((v) => {
      let id: string | undefined
      let name: string | undefined
      if (typeof v.branch === "string") {
        id = v.branch
        const b = getBranchById(v.branch)
        name = b?.name
      } else if (v.branch) {
        id = (v.branch as any).id || (v.branch as any)._id
        name = (v.branch as any).name
      }
      if (id) map.set(id, name || "")
    })
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [activeVacancies])

  const [search, setSearch] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")

  // Derive unique categories from active vacancies
  const categories = useMemo(() => {
    const cats = new Set<string>()
    activeVacancies.forEach((v) => {
      let name = ""
      if (typeof v.job === "string") {
        const jt = getJobTitleById(v.job)
        name = jt?.name || ""
      } else if (v.job) {
        name = (v.job as any).name
      }
      if (name) cats.add(getCategoryTag(name).label)
    })
    return [...cats]
  }, [activeVacancies])

  const filtered = useMemo(() => {
    let result = activeVacancies.filter((v) => {
      // resolve job title and branch info for filtering
      let jtName = ""
      let brId = ""
      let brName = ""

      if (typeof v.job === "string") {
        const jt = getJobTitleById(v.job)
        jtName = jt?.name || ""
      } else if (v.job) {
        jtName = (v.job as any).name || ""
      }

      if (typeof v.branch === "string") {
        brId = v.branch
        const br = getBranchById(v.branch)
        brName = br?.name || ""
      } else if (v.branch) {
        brId = (v.branch as any).id || (v.branch as any)._id || ""
        brName = (v.branch as any).name || ""
      }

      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        jtName.toLowerCase().includes(q) ||
        brName.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      const matchesBranch =
        branchFilter === "all" || brId === branchFilter
      const matchesCategory =
        categoryFilter === "all" ||
        (jtName && getCategoryTag(jtName).label === categoryFilter)
      return matchesSearch && matchesBranch && matchesCategory
    })

    if (sortBy === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      )
    }
    return result
  }, [activeVacancies, search, branchFilter, categoryFilter, sortBy])

  if (activeVacancies.length === 0) return null

  return (
    <section id="vacancies" ref={sectionRef} className="relative bg-gradient-to-b from-secondary/30 via-background to-background section-padding">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Lavozim yoki kalit so'z qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-xl border-border bg-background pl-11 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="h-12 w-full rounded-xl sm:w-44">
              <SelectValue placeholder="Barcha filiallar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha filiallar</SelectItem>
              {allBranches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-12 w-full rounded-xl sm:w-44">
              <SelectValue placeholder="Barcha kategoriyalar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha kategoriyalar</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
      </div>

      <div className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 lg:px-8", visible && "in-view")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="reveal" style={{ transitionDelay: "0ms" }}>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Bo‘sh ish o‘rinlari
            </h2>
            <p className="mt-2 text-muted-foreground">
              EnglishLife jamoasida o‘z o‘rningizni toping
            </p>
          </div>
          <div className="reveal flex items-center gap-2 text-sm" style={{ transitionDelay: "60ms" }}>
            <span className="text-muted-foreground">Saralash</span>
            <div className="flex overflow-hidden rounded-xl border border-border">
              <button
                onClick={() => setSortBy("latest")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "latest"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Yangi
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "popular"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Ommabop
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("mx-auto max-w-7xl px-4 py-10 lg:px-8", visible && "in-view")}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vacancy, idx) => {
            // resolve branch and job info for display
            let branchName = ""
            let branchId = ""
            let jobName = ""

            if (typeof vacancy.branch === "string") {
              branchId = vacancy.branch
              const br = getBranchById(vacancy.branch)
              branchName = br?.name || ""
            } else if (vacancy.branch) {
              branchId = (vacancy.branch as any).id || (vacancy.branch as any)._id || ""
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
                  {/* Tags row */}
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
                       
                       {vacancy.parttime ? "Qisman stavka" : "To‘liq kun"}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    {vacancy.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {vacancy.description}
                  </p>

                  {/* Metadata */}
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

                {/* Footer button */}
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

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">Vakansiya topilmadi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Qidiruv yoki filtrlarni o&apos;zgartiring
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
