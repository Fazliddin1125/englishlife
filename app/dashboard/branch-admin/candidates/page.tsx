"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { CandidateTable } from "@/components/candidate-table"
import { useAuth } from "@/lib/auth-context"
import { getCandidatesByBranch, getBranchById } from "@/lib/store"

function BranchCandidatesContent() {
  const { user } = useAuth()
  if (!user?.branchId) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Ushbu akkauntga filial biriktirilmagan. Super admin orqali filial biriktiring.
        </div>
      </DashboardShell>
    )
  }

  const branch = getBranchById(user.branchId)
  const candidates = getCandidatesByBranch(user.branchId)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nomzodlar</h1>
          <p className="text-sm text-muted-foreground">
            {branch?.name} vakansiyalari bo‘yicha arizalar
          </p>
        </div>
        <CandidateTable initialCandidates={candidates} title={`${branch?.name} — nomzodlar`} />
      </div>
    </DashboardShell>
  )
}

export default function BranchCandidatesPage() {
  return (
    <AuthGuard requiredRole="branch_admin">
      <BranchCandidatesContent />
    </AuthGuard>
  )
}
