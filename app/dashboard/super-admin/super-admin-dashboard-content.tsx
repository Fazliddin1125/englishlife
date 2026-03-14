"use client"

import React from "react"
import Link from "next/link"
import {
  Building2,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard-shell"
import type { IApplication } from "@/types"

function StatCard({
  title,
  value,
  icon,
  description,
  href,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
            <div className="text-primary transition-colors group-hover:text-primary-foreground">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold tabular-nums text-foreground">
              {value}
            </span>
            <ArrowUpRight className="mb-1 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  accepted: "Qabul qilindi",
  rejected: "Rad etildi",
  interview: "Intervyu",
}

function statusClass(status: string): string {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-700"
    case "rejected":
      return "bg-red-50 text-red-700"
    case "interview":
      return "bg-blue-50 text-blue-700"
    default:
      return "bg-yellow-50 text-yellow-700"
  }
}

export type SuperAdminDashboardProps = {
  branchCount: number
  jobCount: number
  vacancyCount: number
  applicationCount: number
  talentPoolCount: number
  recentApplications: IApplication[]
}

export function SuperAdminDashboardContent({
  branchCount,
  jobCount,
  vacancyCount,
  applicationCount,
  talentPoolCount,
  recentApplications,
}: SuperAdminDashboardProps) {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Boshqaruv paneli
          </h1>
          <p className="text-sm text-muted-foreground">
            EnglishLife HR tizimi bo‘yicha umumiy ko‘rinish
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Filiallar"
            value={branchCount}
            icon={<Building2 className="h-5 w-5" />}
            description="Faol filiallar"
            href="/dashboard/super-admin/branches"
          />
          <StatCard
            title="Lavozimlar"
            value={jobCount}
            icon={<Briefcase className="h-5 w-5" />}
            description="Mavjud lavozimlar"
            href="/dashboard/super-admin/job-titles"
          />
          <StatCard
            title="Faol vakansiyalar"
            value={vacancyCount}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Hozir ishga qabul qilinmoqda"
            href="/dashboard/super-admin/vacancies"
          />
          <StatCard
            title="Barcha arizalar"
            value={applicationCount}
            icon={<Users className="h-5 w-5" />}
            description={`Zahira: ${talentPoolCount} ta`}
            href="/dashboard/super-admin/candidates"
          />
          <StatCard
            title="Vakansiyalar"
            value={vacancyCount}
            icon={<Briefcase className="h-5 w-5" />}
            description="Ochiq vakansiyalar"
            href="/dashboard/super-admin/vacancies"
          />
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">
                So‘nggi arizalar
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Hozircha arizalar yo‘q
                </p>
              ) : (
                recentApplications.map((app) => (
                  <Link
                    key={app._id}
                    href={`/dashboard/super-admin/candidates?application=${app._id}`}
                    className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {app.name
                          .trim()
                          .split(/\s+/)
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.phone}
                          {app.createdAt &&
                            ` · ${new Date(app.createdAt).toLocaleDateString("uz-UZ")}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass(app.status)}`}
                    >
                      {STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
