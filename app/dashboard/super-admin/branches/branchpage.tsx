"use client"
import { useEffect, useState } from "react"
import { Building2, Plus, Trash2, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard-shell"

import { IBranch } from "@/types"
import { toast } from "sonner"

function BranchesContent({ branches }: { branches: IBranch[] }) {


  const [dialogOpen, setDialogOpen] = useState(false)

  const [branchesState, setBranchesState] = useState<IBranch[]>(branches)
  useEffect(() => {
    setBranchesState(branches)
  }, [])
  const [name, setName] = useState("")

  async function handleAdd() {
    if (!name.trim()) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/create/branch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      toast.success("Filial muvaffaqiyatli qo‘shildi")
      setBranchesState((prev) => [...prev, { _id: Date.now().toString(), name}]) 
    }

    setName("")

    setDialogOpen(false)
  }

  
  async function handleDelete(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/delete/branch/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      toast.success("Filial o‘chirildi")
      setBranchesState((prev) => prev.filter((b) => b._id !== id))
    } else {
      toast.error("Filialni o‘chirib bo‘lmadi")
    } 

  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Filiallar</h1>
            <p className="text-sm text-muted-foreground">EnglishLife filiallarini boshqarish</p>
          </div>
          <Button className="rounded-full gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Filial qo‘shish
          </Button>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Barcha filiallar ({branchesState.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filial nomi</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead className="w-[80px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchesState.map((branch) => (
                  <TableRow key={branch._id}>
                    <TableCell className="font-medium text-foreground">{branch.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {branch.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        aria-label={`${branch.name} ni o‘chirish`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {branchesState.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Hozircha filiallar yo‘q. &quot;Filial qo‘shish&quot; tugmasini bosing.
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
              <DialogTitle className="text-foreground">Yangi filial</DialogTitle>
              <DialogDescription>Yangi EnglishLife filialini qo‘shish</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch-name">Filial nomi</Label>
                <Input
                  id="branch-name"
                  placeholder="Masalan: Chilonzor filiali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button className="rounded-full" onClick={handleAdd}>Filial qo‘shish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}

export default BranchesContent