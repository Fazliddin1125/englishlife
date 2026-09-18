"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { triggerUnauthorized } from "@/lib/auth-callback"

export default function ChangePasswordPage() {
  const { token } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) {
      toast.error("Avtorizatsiya kerak")
      return
    }
    if (!currentPassword || !newPassword) {
      toast.error("Joriy va yangi parolni kiriting")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parol tasdiqi mos kelmadi")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.status === 401) {
        triggerUnauthorized()
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.failure || data.message || "Parolni yangilab bo'lmadi")
        return
      }
      toast.success(data.message || "Parol muvaffaqiyatli yangilandi")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Tarmoq xatosi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <DashboardShell>
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parolni yangilash</h1>
            <p className="text-sm text-muted-foreground">
              Joriy parolingizni kiriting va yangi parol qo&apos;ying
            </p>
          </div>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <KeyRound className="h-5 w-5 text-primary" />
                Parolni o&apos;zgartirish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Joriy parol</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yangi parol</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" className="rounded-full" disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Parolni yangilash"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </AuthGuard>
  )
}
