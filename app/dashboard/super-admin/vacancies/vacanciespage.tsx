"use client"

import { useEffect, useState } from "react"
import { Building2, Plus, Trash2, Eye, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/lib/auth-context"
import { IBranch, IVacancy } from "@/types"
import { toast } from "sonner"
import {
  fetchBranches,
  fetchJobs,
  fetchUsers,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  type VacancyPayload,
} from "@/actions/vacancy.action"

type BranchOption = IBranch
type JobOption = { _id: string; name: string }
type UserOption = { _id: string; username: string; fullname?: string }

function VacanciesContent({ vacancies }: { vacancies: IVacancy[] }) {
  const { token } = useAuth()
  const [vacanciesState, setVacanciesState] = useState<IVacancy[]>(vacancies)
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])

  const [formOpen, setFormOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<IVacancy | null>(null)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [branchId, setBranchId] = useState("")
  const [jobId, setJobId] = useState("")
  const [ownerId, setOwnerId] = useState("")
  const [status, setStatus] = useState(true)
  const [parttime, setParttime] = useState(true)
  const [online, setOnline] = useState(false)
  const [requirmentsText, setRequirmentsText] = useState("")

  const [viewOpen, setViewOpen] = useState(false)
  const [viewVacancy, setViewVacancy] = useState<IVacancy | null>(null)

  useEffect(() => {
    setVacanciesState(vacancies)
  }, [vacancies])

  useEffect(() => {
    async function load() {
      const [b, j, u] = await Promise.all([
        fetchBranches(),
        fetchJobs(),
        fetchUsers(),
      ])
      setBranches(b)
      setJobs(j)
      setUsers(u)
    }
    load()
  }, [])

  function resetForm() {
    setEditingVacancy(null)
    setTitle("")
    setDescription("")
    setBranchId("")
    setJobId("")
    setOwnerId("")
    setStatus(true)
    setParttime(true)
    setOnline(false)
    setRequirmentsText("")
  }

  function openCreate() {
    resetForm()
    if (branches.length) setBranchId(branches[0]._id)
    if (jobs.length) setJobId(jobs[0]._id)
    setFormOpen(true)
  }

  function openEdit(v: IVacancy) {
    setEditingVacancy(v)
    setTitle(v.title)
    setDescription(v.description)
    setBranchId(typeof v.branch === "object" && v.branch ? v.branch._id : "")
    setJobId(typeof v.job === "object" && v.job ? (v.job as { _id?: string })._id ?? (v.job as { id?: string }).id ?? "" : "")
    setOwnerId(typeof v.owner === "object" && v.owner ? (v.owner as { _id?: string })._id ?? (v.owner as { id?: string }).id ?? "" : "")
    setStatus(v.status ?? true)
    setParttime(v.parttime ?? true)
    setOnline(v.online ?? false)
    setRequirmentsText((v.requirments ?? []).join("\n"))
    setFormOpen(true)
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !branchId || !jobId) {
      toast.error("Sarlavha, tavsif, filial va lavozim to'ldirilishi shart")
      return
    }
    if (editingVacancy && !ownerId) {
      toast.error("Egasi tanlanishi shart")
      return
    }
    if (!token) {
      toast.error("Avtorizatsiya kerak")
      return
    }
    setSaving(true)
    const requirments = requirmentsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    try {
      if (editingVacancy) {
        const payload: VacancyPayload = {
          title: title.trim(),
          description: description.trim(),
          branch: branchId,
          job: jobId,
          owner: ownerId,
          status,
          parttime,
          online,
          requirments,
        }
        const updated = await updateVacancy(editingVacancy._id, payload, token)
        if (updated) {
          setVacanciesState((prev) =>
            prev.map((v) => (v._id === editingVacancy._id ? updated : v))
          )
          toast.success("Vakansiya yangilandi")
          setFormOpen(false)
          resetForm()
        } else {
          toast.error("Yangilashda xato")
        }
      } else {
        const created = await createVacancy(
          {
            title: title.trim(),
            description: description.trim(),
            branch: branchId,
            job: jobId,
            status,
            parttime,
            online,
            requirments,
          },
          token
        )
        if (created) {
          setVacanciesState((prev) => [...prev, created])
          toast.success("Vakansiya yaratildi (egasi: siz)")
          setFormOpen(false)
          resetForm()
        } else {
          toast.error("Yaratishda xato")
        }
      }
    } finally {
      setSaving(false)
    }
  }

  function ViewOne(v: IVacancy) {
    setViewVacancy(v)
    setViewOpen(true)
  }

  async function handleDelete(id: string) {
    if (!token) {
      toast.error("Avtorizatsiya kerak")
      return
    }
    const ok = await deleteVacancy(id, token)
    if (ok) {
      setVacanciesState((prev) => prev.filter((v) => v._id !== id))
      toast.success("Vakansiya o'chirildi")
    } else {
      toast.error("O'chirishda xato")
    }
  }

  const getBranchName = (v: IVacancy) =>
    typeof v.branch === "object" && v.branch ? v.branch.name : ""
  const getJobName = (v: IVacancy) =>
    typeof v.job === "object" && v.job ? (v.job as { name?: string }).name ?? "" : ""
  const getOwnerName = (v: IVacancy) =>
    typeof v.owner === "object" && v.owner ? (v.owner as { fullname?: string }).fullname ?? (v.owner as { username?: string }).username ?? "" : ""

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vakansiyalar</h1>
            <p className="text-sm text-muted-foreground">EnglishLife vakansiyalarini boshqarish</p>
          </div>
          <Button className="rounded-full gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Vakansiya qo‘shish
          </Button>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Barcha vakansiyalar ({vacanciesState.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sarlavha</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Lavozim</TableHead>
                  <TableHead>Egasi</TableHead>
                  <TableHead className="w-[120px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacanciesState.map((vacancy) => (
                  <TableRow key={vacancy._id}>
                    <TableCell className="font-medium text-foreground">{vacancy.title}</TableCell>
                    <TableCell className="text-muted-foreground">{getBranchName(vacancy)}</TableCell>
                    <TableCell className="text-muted-foreground">{getJobName(vacancy)}</TableCell>
                    <TableCell className="text-muted-foreground">{getOwnerName(vacancy)}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => ViewOne(vacancy)}
                        aria-label="Ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(vacancy)}
                        aria-label="Tahrirlash"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(vacancy._id)}
                        aria-label="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {vacanciesState.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Vakansiyalar yo‘q. &quot;Vakansiya qo‘shish&quot; orqali qo‘shing.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create / Edit modal */}
        <Dialog open={formOpen} onOpenChange={(open) => !open && (setFormOpen(false), resetForm())}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingVacancy ? "Vakansiyani tahrirlash" : "Yangi vakansiya"}
              </DialogTitle>
              <DialogDescription>
                {editingVacancy ? "Ma'lumotlarni o'zgartiring va saqlang." : "Vakansiya ma'lumotlarini kiriting."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Sarlavha</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: IELTS o'qituvchisi"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Tavsif</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vakansiya tavsifi..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Filial</Label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Filial tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lavozim</Label>
                  <Select value={jobId} onValueChange={setJobId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Lavozim tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((j) => (
                        <SelectItem key={j._id} value={j._id}>
                          {j.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {editingVacancy && (
                <div className="space-y-2">
                  <Label>Egasi</Label>
                  <Select value={ownerId} onValueChange={setOwnerId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Foydalanuvchi tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.fullname || u.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="status" checked={status} onCheckedChange={setStatus} />
                  <Label htmlFor="status">Aktiv</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="parttime" checked={parttime} onCheckedChange={setParttime} />
                  <Label htmlFor="parttime">Qisman stavka</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="online" checked={online} onCheckedChange={setOnline} />
                  <Label htmlFor="online">Onlayn</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Talablar (har bir qatorda bitta)</Label>
                <Textarea
                  value={requirmentsText}
                  onChange={(e) => setRequirmentsText(e.target.value)}
                  placeholder="IELTS 7+&#10;2 yillik tajriba&#10;..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full" onClick={() => setFormOpen(false)}>
                Bekor qilish
              </Button>
              <Button className="rounded-full" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saqlanmoqda..." : editingVacancy ? "Saqlash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">{viewVacancy?.title ?? ""}</DialogTitle>
              <DialogDescription>{viewVacancy?.description ?? ""}</DialogDescription>
              {viewVacancy && (
                <p className="text-sm text-muted-foreground">
                  Egasi: {getOwnerName(viewVacancy)}
                </p>
              )}
            </DialogHeader>
            {viewVacancy && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Filial</Label>
                    <p className="text-sm font-medium">{getBranchName(viewVacancy)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Lavozim</Label>
                    <p className="text-sm font-medium">{getJobName(viewVacancy)}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>Onlayn: {viewVacancy.online ? "Ha" : "Yo'q"}</span>
                  <span>Qisman: {viewVacancy.parttime ? "Ha" : "Yo'q"}</span>
                </div>
                {viewVacancy.requirments && viewVacancy.requirments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Talablar</Label>
                    <ul className="list-inside list-disc text-sm">
                      {viewVacancy.requirments.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}

export default VacanciesContent
