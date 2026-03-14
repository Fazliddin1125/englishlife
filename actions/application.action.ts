import type { IApplication } from "@/types"

const API = process.env.NEXT_PUBLIC_API_URL

export async function fetchApplications(): Promise<IApplication[]> {
  const res = await fetch(`${API}/application/all`, { cache: "no-store" })
  if (!res.ok) throw new Error("Arizalarni yuklashda xato")
  const data = await res.json()
  return data.applications ?? []
}

export async function fetchApplicationDetail(id: string): Promise<IApplication | null> {
  const res = await fetch(`${API}/application/detail/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.application ?? null
}

export async function updateApplication(
  id: string,
  body: Partial<Pick<IApplication, "name" | "age" | "phone" | "university" | "lastwork" | "hasCertificate" | "certificate" | "maried" | "ielts" | "status">>
): Promise<IApplication | null> {
  const res = await fetch(`${API}/application/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.application ?? null
}

export async function changeApplicationStatus(
  id: string,
  status: IApplication["status"]
): Promise<IApplication | null> {
  const res = await fetch(`${API}/application/change-status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.application ?? null
}

export async function deleteApplication(id: string): Promise<boolean> {
  const res = await fetch(`${API}/application/delete/${id}`, { method: "DELETE" })
  return res.ok
}

/** Zahira (talent pool) – vakansiyasiz ariza. FormData: name, age, phone, university, lastwork, hasCertificate, certificate, maried, ielts, photo (file). */
export async function submitTalentPoolApplication(formData: FormData): Promise<boolean> {
  const res = await fetch(`${API}/application/apply`, {
    method: "POST",
    body: formData,
  })
  return res.ok
}

export async function fetchTalentPoolApplications(): Promise<IApplication[]> {
  const res = await fetch(`${API}/application/talent-pool`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.applications ?? []
}
