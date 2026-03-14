import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApplicationsTable } from "@/components/applications-table"
import { fetchTalentPoolApplications } from "@/actions/application.action"

export default async function TalentPoolPage() {
  let applications: Awaited<ReturnType<typeof fetchTalentPoolApplications>> = []
  try {
    applications = await fetchTalentPoolApplications()
  } catch (e) {
    console.error("Talent pool fetch error:", e)
  }

  return (
    <AuthGuard requiredRole="super_admin">
      <DashboardShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Zahira (Talent Pool)</h1>
            <p className="text-sm text-muted-foreground">
              Vakansiya tanlamagan nomzodlar – ular admin panelda ko&apos;rinadi, vakansiya ochilganda ular bilan bog&apos;lanish mumkin.
            </p>
          </div>
          <ApplicationsTable
            initialApplications={applications}
            title="Zahira arizalari"
            hideVacancyColumn
          />
        </div>
      </DashboardShell>
    </AuthGuard>
  )
}
