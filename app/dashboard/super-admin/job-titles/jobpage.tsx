"use client"
import { useEffect, useState } from "react"
import { Briefcase, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard-shell"


import { IBranch } from "@/types"
import { toast } from "sonner"

function JobsContent({ branches }: { branches: IBranch[] }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [branchesState, setBranchesState] = useState<IBranch[]>(branches)

  useEffect(() => {
    setBranchesState(branches)
  }, [])

  const [name, setName] = useState("")

  async function handleAdd() {
    if (!name.trim()) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/create/job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      toast.success("Lavozim muvaffaqiyatli qo‘shildi")
      setBranchesState((prev) => [...prev, { _id: Date.now().toString(), name}]) 
    }

    setName("")

    setDialogOpen(false)
  }

  
  async function handleDelete(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/delete/job/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      toast.success("Lavozim o‘chirildi")
      setBranchesState((prev) => prev.filter((b) => b._id !== id))
    } else {
      toast.error("Lavozimni o‘chirib bo‘lmadi")
    } 

  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lavozimlar</h1>
            <p className="text-sm text-muted-foreground">Kasb/lavozimlarni boshqarish</p>
          </div>
          <Button className="rounded-full gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Lavozim qo‘shish
          </Button>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Barcha lavozimlar ({branchesState.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lavozim nomi</TableHead>
                  <TableHead className="w-[80px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchesState.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium text-foreground">{job.name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        aria-label={`${job.name} ni o‘chirish`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {branchesState.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                      Hozircha lavozimlar yo‘q. &quot;Lavozim qo‘shish&quot; tugmasini bosing.
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
              <DialogTitle className="text-foreground">Yangi lavozim</DialogTitle>
              <DialogDescription>Yangi lavozim (kasb) qo‘shish</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-name">Lavozim nomi</Label>
                <Input
                  id="job-name"
                  placeholder="Masalan: Ingliz tili o‘qituvchisi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button className="rounded-full" onClick={handleAdd}>Lavozim qo‘shish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}

export default JobsContent