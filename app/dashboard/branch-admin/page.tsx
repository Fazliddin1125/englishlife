"use client"

import { Briefcase, Users, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { getVacanciesByBranch, getCandidatesByBranch, getBranchById } from "@/lib/store"

function BranchDashboardContent() {
  const { user } = useAuth()
  if (!user?.branchId) return null

  const branch = getBranchById(user.branchId)
  const vacancies = getVacanciesByBranch(user.branchId)
  const candidates = getCandidatesByBranch(user.branchId)
  const activeVacancies = vacancies.filter((v) => v.isActive)
  const waitingCandidates = candidates.filter((c) => c.status === "waiting")

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{branch?.name} — Boshqaruv paneli</h1>
          <p className="text-sm text-muted-foreground">Filial vakansiyalari va nomzodlari</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Faol vakansiyalar</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{activeVacancies.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">jami {vacancies.length} ta</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Barcha nomzodlar</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{candidates.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">{waitingCandidates.length} ta ko‘rib chiqish kutilmoqda</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bog‘langan</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {candidates.filter((c) => c.contacted).length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">jami {candidates.length} ta</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">So‘nggi arizalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidates.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">Hozircha arizalar yo‘q.</p>
              ) : (
                candidates.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.fullName}</p>
                      <p className="text-xs text-muted-foreground">{c.desiredRole} &middot; {c.appliedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.contacted && (
                        <span className="text-xs text-muted-foreground">Bog‘langan</span>
                      )}
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.status === "accepted" ? "bg-green-50 text-green-700" :
                        c.status === "rejected" ? "bg-red-50 text-red-700" :
                        c.status === "interview" ? "bg-blue-50 text-blue-700" :
                        "bg-yellow-50 text-yellow-700"
                      }`}>
                        {c.status === "accepted" ? "Qabul" : c.status === "rejected" ? "Rad" : c.status === "interview" ? "Intervyu" : "Kutilmoqda"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

export default function BranchAdminDashboard() {
  return (
    <AuthGuard requiredRole="branch_admin">
      <BranchDashboardContent />
    </AuthGuard>
  )
}
