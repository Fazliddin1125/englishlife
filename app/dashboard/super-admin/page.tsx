import { fetchBranches, fetchJobs, fetchVacancies } from "@/actions/vacancy.action"
import { fetchApplications } from "@/actions/application.action"
import { AuthGuard } from "@/components/auth-guard"
import { SuperAdminDashboardContent } from "./super-admin-dashboard-content"

export default async function SuperAdminDashboardPage() {
  const [branches, jobs, vacancyRes, applications] = await Promise.all([
    fetchBranches(),
    fetchJobs(),
    fetchVacancies(),
    fetchApplications().catch(() => []),
  ])

  const vacancies = vacancyRes.vacancies ?? []
  const activeVacancies = vacancies.filter((v) => v.status === true)
  const talentPool = applications.filter((a) => !a.vacancy || (typeof a.vacancy === "string" && !a.vacancy))

  const recentApplications = [...applications]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
    .slice(0, 5)

  return (
    <AuthGuard requiredRole="super_admin">
      <SuperAdminDashboardContent
        branchCount={branches.length}
        jobCount={jobs.length}
        vacancyCount={activeVacancies.length}
        applicationCount={applications.length}
        talentPoolCount={talentPool.length}
        recentApplications={recentApplications}
      />
    </AuthGuard>
  )
}
