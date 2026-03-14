import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApplicationsTable } from "@/components/applications-table"
import { fetchApplications } from "@/actions/application.action"

export default async function AllCandidatesPage() {
  let applications: Awaited<ReturnType<typeof fetchApplications>> = []
  try {
    applications = await fetchApplications()
  } catch (e) {
    console.error("Candidates fetch error:", e)
  }

  return (
    <AuthGuard requiredRole="super_admin">
      <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Barcha nomzodlar</h1>
          <p className="text-sm text-muted-foreground">
            Barcha filiallar va vakansiyalar bo&apos;yicha arizalar (backend Application)
          </p>
        </div>
        <ApplicationsTable
          initialApplications={applications}
          title="Barcha nomzodlar"
        />
      </div>
      </DashboardShell>
    </AuthGuard>
  )
}
