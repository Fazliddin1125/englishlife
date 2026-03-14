"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/store"

export function AuthGuard({ children, requiredRole }: { children: ReactNode; requiredRole?: Role }) {
  const { user, isAuthenticated, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isReady) return
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.replace("/login")
    }
  }, [isReady, isAuthenticated, requiredRole, user?.role, router])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Qayta yo&apos;naltirilmoqda...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
