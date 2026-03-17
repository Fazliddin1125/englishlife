"use client"

import { useState, useMemo } from "react"
import {
  Phone,
  FileText,
  Search,
  GraduationCap,
  Award,
  User,
  Eye,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { IApplication, ApplicationStatus } from "@/types"
import {
  changeApplicationStatus,
  deleteApplication,
} from "@/actions/application.action"
import { toast } from "sonner"

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "accepted", label: "Qabul qilindi" },
  { value: "rejected", label: "Rad etildi" },
]

function statusBadgeClass(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-700 border-green-200"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
  }
}

function getVacancyTitle(app: IApplication): string {
  const v = app.vacancy
  if (!v) return "Zahira (vakansiyasiz ariza)"
  if (typeof v === "string") return v
  return v.title ?? "—"
}

export function ApplicationsTable({
  initialApplications,
  title = "Barcha nomzodlar",
  hideVacancyColumn = false,
}: {
  initialApplications: IApplication[]
  title?: string
  hideVacancyColumn?: boolean
}) {
  const [applications, setApplications] = useState<IApplication[]>(initialApplications)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [viewApp, setViewApp] = useState<IApplication | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [photoApp, setPhotoApp] = useState<IApplication | null>(null)

  const branchOptions = useMemo(() => {
    const map = new Map<string, string>()
    applications.forEach((app) => {
      const v = app.vacancy as any
      if (v && typeof v === "object" && v.branch) {
        const b = v.branch as any
        const id = b._id || b.id
        const name = b.name
        if (id && name && !map.has(id)) {
          map.set(id, name)
        }
      }
    })
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [applications])

  const jobOptions = useMemo(() => {
    const map = new Map<string, string>()
    applications.forEach((app) => {
      const v = app.vacancy as any
      if (v && typeof v === "object" && v.job) {
        const j = v.job as any
        const id = j._id || j.id
        const name = j.name
        if (id && name && !map.has(id)) {
          map.set(id, name)
        }
      }
    })
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [applications])

  const filtered = useMemo(() => {
    const base = applications.filter((app) => {
      const matchSearch =
        !search ||
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.phone.includes(search) ||
        (app.university ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (app.ielts ?? "").toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || app.status === statusFilter
      const v = app.vacancy as any
      const branchId =
        v && typeof v === "object" && v.branch
          ? (v.branch as any)._id || (v.branch as any).id
          : ""
      const jobId =
        v && typeof v === "object" && v.job
          ? (v.job as any)._id || (v.job as any).id
          : ""
      const matchBranch = branchFilter === "all" || branchId === branchFilter
      const matchJob = jobFilter === "all" || jobId === jobFilter
      return matchSearch && matchStatus && matchBranch && matchJob
    })

    // Yangi arizalar tepada ko'rinishi uchun createdAt bo'yicha kamayish tartibida saralash
    return base.sort((a, b) => {
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bd - ad
    })
  }, [applications, search, statusFilter, branchFilter, jobFilter])

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    const updated = await changeApplicationStatus(id, status)
    if (updated) {
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? updated : a))
      )
      toast.success("Status yangilandi")
    } else {
      toast.error("Status yangilashda xato")
    }
  }

  async function handleDelete(id: string) {
    const ok = await deleteApplication(id)
    if (ok) {
      setApplications((prev) => prev.filter((a) => a._id !== id))
      toast.success("Ariza o'chirildi")
      setDeleteId(null)
    } else {
      toast.error("O'chirishda xato")
    }
  }

  return (
    <>
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            {title} ({filtered.length})
          </CardTitle>
          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ism, telefon, universitet, IELTS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-full border-0 bg-secondary pl-10"
                />
              </div>
              {!hideVacancyColumn && (
                <>
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="h-9 w-full rounded-full border-0 bg-secondary sm:w-44">
                      <SelectValue placeholder="Filial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha filiallar</SelectItem>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={jobFilter} onValueChange={setJobFilter}>
                    <SelectTrigger className="h-9 w-full rounded-full border-0 bg-secondary sm:w-44">
                      <SelectValue placeholder="Lavozim" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha lavozimlar</SelectItem>
                      {jobOptions.map((j) => (
                        <SelectItem key={j.id} value={j.id}>
                          {j.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-secondary p-1">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Barchasi
              </button>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatusFilter(s.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    statusFilter === s.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Ism</TableHead>
                  {!hideVacancyColumn && <TableHead>Vakansiya</TableHead>}
                  <TableHead>Telefon / Yosh</TableHead>
                  <TableHead>Ta&apos;lim / IELTS</TableHead>
                  <TableHead>Sertifikat</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-[120px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground"
                          onClick={() => {
                            if (app.photo) setPhotoApp(app)
                          }}
                          aria-label="Profil rasmini ko'rish"
                        >
                          {app.photo ? (
                            <img
                              src={app.photo}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </button>
                        <div>
                          <p className="font-medium text-foreground">{app.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.lastwork ? `${app.lastwork.slice(0, 40)}${app.lastwork.length > 40 ? "…" : ""}` : "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {!hideVacancyColumn && (
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {getVacancyTitle(app)}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {app.phone}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {app.age} yosh
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="block text-xs text-foreground">
                          {app.university || "—"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          IELTS: {app.ielts || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {app.hasCertificate ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          <Award className="h-3 w-3" />
                          {app.certificate || "Bor"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Yo&apos;q</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(val) =>
                          handleStatusChange(app._id, val as ApplicationStatus)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 w-[130px] rounded-full border text-xs font-medium ${statusBadgeClass(app.status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewApp(app)}
                          aria-label="Ko'rish"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(app._id)}
                          aria-label="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={hideVacancyColumn ? 6 : 7}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Nomzod topilmadi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View modal */}
      <Dialog open={!!viewApp} onOpenChange={(open) => !open && setViewApp(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nomzod ma&apos;lumotlari</DialogTitle>
            <DialogDescription>{viewApp?.name}</DialogDescription>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {viewApp.photo ? (
                    <img src={viewApp.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{viewApp.name}</p>
                  <p className="text-sm text-muted-foreground">{viewApp.age} yosh</p>
                  <p className="text-sm text-muted-foreground">{viewApp.phone}</p>
                </div>
              </div>
              {!hideVacancyColumn && (
                <div>
                  <Label className="text-muted-foreground">Vakansiya</Label>
                  <p className="text-sm font-medium">{getVacancyTitle(viewApp)}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Universitet</Label>
                <p className="text-sm">{viewApp.university || "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Oxirgi ish / tajriba</Label>
                <p className="text-sm whitespace-pre-wrap">{viewApp.lastwork || "—"}</p>
              </div>
              {hideVacancyColumn && viewApp.motivationLetter && (
                <div>
                  <Label className="text-muted-foreground">Motivatsion xat</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap rounded-lg border bg-muted/30 p-3">
                    {viewApp.motivationLetter}
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <Label className="text-muted-foreground">IELTS</Label>
                  <p className="text-sm">{viewApp.ielts || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Holat</Label>
                  <p className="text-sm font-medium">{STATUS_OPTIONS.find((s) => s.value === viewApp.status)?.label ?? viewApp.status}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Sertifikat</Label>
                {viewApp.hasCertificate ? (
                  <div className="mt-1 space-y-1">
                    {viewApp.certificate && (
                      <p className="text-sm">{viewApp.certificate}</p>
                    )}
                    {viewApp.certificateUrls && viewApp.certificateUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {viewApp.certificateUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline"
                          >
                            Sertifikat {viewApp.certificateUrls!.length > 1 ? i + 1 : ""}
                          </a>
                        ))}
                      </div>
                    )}
                    {!viewApp.certificate && (!viewApp.certificateUrls || viewApp.certificateUrls.length === 0) && (
                      <p className="text-sm text-muted-foreground">Bor (fayl yuklanmagan)</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">Yo&apos;q</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arizani o&apos;chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Ushbu arizani o&apos;chirishga ishonchingiz komilmi? Bu amalni qaytarib bo&apos;lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Bekor qilish</AlertDialogCancel>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={async () => {
                if (deleteId) {
                  await handleDelete(deleteId)
                }
              }}
            >
              O&apos;chirish
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo preview dialog */}
      <Dialog open={!!photoApp} onOpenChange={(open) => !open && setPhotoApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {photoApp?.name}
            </DialogTitle>
            <DialogDescription>Profil rasmi</DialogDescription>
          </DialogHeader>
          {photoApp?.photo ? (
            <div className="flex justify-center">
              <img
                src={photoApp.photo}
                alt={photoApp.name}
                className="max-h-[400px] w-auto rounded-xl object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Rasm mavjud emas.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
