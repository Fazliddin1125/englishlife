"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

const API = process.env.NEXT_PUBLIC_API_URL

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated, isReady, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isReady) return
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        router.replace("/dashboard/super-admin")
      } else {
        router.replace("/dashboard/branch-admin")
      }
    }
  }, [isReady, isAuthenticated, user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.failure || "Login yoki parol noto'g'ri")
        return
      }
      const backendUser = data.user
      const accessToken = data.accessToken
      if (!backendUser || !accessToken) {
        setError("Server javobi noto'g'ri")
        return
      }
      const role = backendUser.role === "superadmin" ? "super_admin" : "branch_admin"
      login(
        {
          id: backendUser.id,
          name: backendUser.fullname || backendUser.username || "",
          email: backendUser.username || "",
          role,
          branchId: null,
        },
        accessToken
      )
      if (role === "super_admin") {
        router.push("/dashboard/super-admin")
      } else {
        router.push("/dashboard/branch-admin")
      }
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  if (!isReady || (isAuthenticated && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md px-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-background">
              English<span className="text-primary">Life</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight text-background">
            HR boshqaruv tizimi
          </h2>
          <p className="mt-4 leading-relaxed text-background/50">
            Filiallar, vakansiyalar va nomzodlar arizalarini bitta paneldan boshqaring.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifaga
          </Link>

          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              English<span className="text-primary">Life</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-foreground">Xush kelibsiz</h1>
          <p className="mt-2 mb-8 text-sm text-muted-foreground">
            Admin panelga kirish uchun tizimga kiring
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Foydalanuvchi</Label>
              <Input
                id="username"
                type="text"
                placeholder="Foydalanuvchi nomi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full gap-2 rounded-full"
              size="lg"
              disabled={loading}
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Backend orqali kirish. Superadmin uchun DB da role: &quot;superadmin&quot; bo&apos;lishi kerak.
          </p>
        </div>
      </div>
    </div>
  )
}
