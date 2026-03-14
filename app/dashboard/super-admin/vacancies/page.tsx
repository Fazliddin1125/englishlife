

import { AuthGuard } from "@/components/auth-guard"
import VacanciesContent from "./vacanciespage"
import type { IVacancy } from "@/types"



export default async function VacanciesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vacancy/get`, {
    cache: "no-store",
  })
  if (!res.ok){
    console.error("Failed to fetch branches:", res.statusText)
  }
  const data = await res.json().catch(() => ({}))
  const vacancies = (data.vacancies ?? []) as IVacancy[]
  return (
    <AuthGuard requiredRole="super_admin">
      <VacanciesContent vacancies={vacancies} />
    </AuthGuard>
  )
}
