import type { IBranch, IVacancy } from "@/types"
import { triggerUnauthorized } from "@/lib/auth-callback"

const API = process.env.NEXT_PUBLIC_API_URL

export type VacancyPayload = {
  title: string
  description: string
  branch: string
  job: string
  owner?: string
  status?: boolean
  parttime?: boolean
  online?: boolean
  requirments?: string[]
}

export async function fetchVacancies(): Promise<{ vacancies: IVacancy[] }> {
  try {
    const res = await fetch(`${API}/vacancy/get`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch vacancies")
    const data = await res.json()
    return { vacancies: data.vacancies ?? [] }
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    return { vacancies: [] }
  }
}

export async function getVacancyDetail(id: string): Promise<IVacancy | null> {
  try {
    const res = await fetch(`${API}/vacancy/get/${id}`, { next: { revalidate: 0 } })
    if (!res.ok) return null
    const data = await res.json()
    return data.vacancy ?? null
  } catch (error) {
    console.error("Fetch xatosi:", error)
    return null
  }
}

export async function fetchBranches(): Promise<IBranch[]> {
  const res = await fetch(`${API}/utility/get/branch`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.branchs ?? []
}

export async function fetchJobs(): Promise<{ _id: string; name: string }[]> {
  const res = await fetch(`${API}/utility/get/job`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.jobs ?? []
}

export async function fetchUsers(): Promise<{ _id: string; username: string; fullname?: string }[]> {
  const res = await fetch(`${API}/utility/get/users`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.users ?? []
}

export async function createVacancy(
  payload: Omit<VacancyPayload, "owner">,
  token: string
): Promise<IVacancy | null> {
  const res = await fetch(`${API}/vacancy/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) {
    triggerUnauthorized()
    return null
  }
  if (!res.ok) return null
  const data = await res.json()
  return data.vacancy ?? null
}

export async function updateVacancy(
  id: string,
  payload: Partial<VacancyPayload>,
  token: string
): Promise<IVacancy | null> {
  const res = await fetch(`${API}/vacancy/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) {
    triggerUnauthorized()
    return null
  }
  if (!res.ok) return null
  const data = await res.json()
  return data.vacancy ?? null
}

export async function deleteVacancy(id: string, token: string): Promise<boolean> {
  const res = await fetch(`${API}/vacancy/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) {
    triggerUnauthorized()
    return false
  }
  return res.ok
}


