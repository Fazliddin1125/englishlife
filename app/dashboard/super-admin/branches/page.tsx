

import { AuthGuard } from "@/components/auth-guard"

import BranchesContent from "./branchpage"
import { IBranch } from "@/types"



export default async function BranchesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/get/branch`, {
    cache: "no-store",
  })
  if (!res.ok){
    console.error("Failed to fetch branches:", res.statusText)
  }
  const data = await res.json()
  console.log("Fetched branches in BranchesPage:", data.branchs as IBranch[])
  return (
    <AuthGuard requiredRole="super_admin">
      <BranchesContent branches={data.branchs as IBranch[]} />
    </AuthGuard>
  )
}
