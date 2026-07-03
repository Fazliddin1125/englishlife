import { AuthGuard } from "@/components/auth-guard"

import DistrictsContent from "./districtpage"
import { IBranch } from "@/types"

export default async function DistrictsPage() {
  let districts: IBranch[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/get/district`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      districts = (data.districts as IBranch[]) ?? []
    }
  } catch (e) {
    console.error("Failed to fetch districts:", e)
  }

  return (
    <AuthGuard requiredRole="super_admin">
      <DistrictsContent districts={districts} />
    </AuthGuard>
  )
}
