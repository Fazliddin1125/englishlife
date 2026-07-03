"use client"
import { useEffect, useState } from "react"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard-shell"

import { IBranch } from "@/types"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

function DistrictsContent({ districts }: { districts: IBranch[] }) {
  const { token } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [districtsState, setDistrictsState] = useState<IBranch[]>(districts)

  useEffect(() => {
    setDistrictsState(districts)
  }, [])

  const [name, setName] = useState("")

  async function handleAdd() {
    if (!name.trim()) return
    if (!token) return toast.error("Siz tizimga kirmagansiz")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/create/district`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      const created = data.district
      toast.success("Tuman muvaffaqiyatli qo‘shildi")
      setDistrictsState((prev) => [...prev, created?._id ? created : { _id: Date.now().toString(), name }])
    } else {
      toast.error("Tumanni qo‘shib bo‘lmadi")
    }

    setName("")
    setDialogOpen(false)
  }

  async function handleDelete(id: string) {
    if (!token) return toast.error("Siz tizimga kirmagansiz")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/delete/district/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      toast.success("Tuman o‘chirildi")
      setDistrictsState((prev) => prev.filter((b) => b._id !== id))
    } else {
      toast.error("Tumanni o‘chirib bo‘lmadi")
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tumanlar (yashash manzili)</h1>
            <p className="text-sm text-muted-foreground">Nomzodlar tanlaydigan yashash manzillarini boshqarish</p>
          </div>
          <Button className="rounded-full gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Tuman qo‘shish
          </Button>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Barcha tumanlar ({districtsState.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuman nomi</TableHead>
                  <TableHead className="w-[80px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {districtsState.map((district) => (
                  <TableRow key={district._id}>
                    <TableCell className="font-medium text-foreground">{district.name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(district._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        aria-label={`${district.name} ni o‘chirish`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {districtsState.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                      Hozircha tumanlar yo‘q. &quot;Tuman qo‘shish&quot; tugmasini bosing.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Yangi tuman</DialogTitle>
              <DialogDescription>Yangi yashash manzili (tuman) qo‘shish</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="district-name">Tuman nomi</Label>
                <Input
                  id="district-name"
                  placeholder="Masalan: Asaka tumani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button className="rounded-full" onClick={handleAdd}>Tuman qo‘shish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}

export default DistrictsContent
