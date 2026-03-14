

import { AuthGuard } from "@/components/auth-guard"


import { IBranch } from "@/types"
import JobsContent from "./jobpage"



export default async function BranchesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/get/job`, {
    cache: "no-store",
  })
  if (!res.ok) {
    console.error("Failed to fetch branches:", res.statusText)
  }
  const data = await res.json()
  console.log("Fetched branches in BranchesPage:", data.jobs as IBranch[])
  return (
    <AuthGuard requiredRole="super_admin">
      <JobsContent branches={data.jobs as IBranch[]} />
    </AuthGuard>
  )
}
