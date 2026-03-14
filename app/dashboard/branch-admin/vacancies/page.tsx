"use client"

import { useState } from "react"
import { Briefcase, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import {
  getVacanciesByBranch,
  getJobTitles,
  getJobTitleById,
  addVacancy,
  toggleVacancyActive,
  deleteVacancy,
  type Vacancy,
} from "@/lib/store"

function VacanciesContent() {
  const { user } = useAuth()
  if (!user?.branchId) return null

  return <VacanciesInner branchId={user.branchId} />
}

function VacanciesInner({ branchId }: { branchId: string }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(getVacanciesByBranch(branchId))
  const jobTitles = getJobTitles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedJobTitle, setSelectedJobTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")

  function handleAdd() {
    if (!selectedJobTitle || !description.trim()) return
    const newVacancy = addVacancy({
      branchId,
      jobTitleId: selectedJobTitle,
      description,
      requirements,
      isActive: true,
    })
    setVacancies([...vacancies, newVacancy])
    setSelectedJobTitle("")
    setDescription("")
    setRequirements("")
    setDialogOpen(false)
  }

  function handleToggle(id: string) {
    toggleVacancyActive(id)
    setVacancies(vacancies.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)))
  }

  function handleDelete(id: string) {
    deleteVacancy(id)
    setVacancies(vacancies.filter((v) => v.id !== id))
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vakansiyalar</h1>
            <p className="text-sm text-muted-foreground">Filial uchun vakansiyalar yaratish va boshqarish</p>
          </div>
          <Button className="rounded-full gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Yangi vakansiya
          </Button>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Filial vakansiyalari ({vacancies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lavozim</TableHead>
                  <TableHead className="hidden md:table-cell">Tavsif</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Yaratilgan</TableHead>
                  <TableHead className="w-[100px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacancies.map((vacancy) => {
                  const jt = getJobTitleById(vacancy.jobTitleId)
                  return (
                    <TableRow key={vacancy.id}>
                      <TableCell className="font-medium text-foreground">{jt?.name || "Noma'lum"}</TableCell>
                      <TableCell className="hidden max-w-[300px] truncate text-muted-foreground md:table-cell">
                        {vacancy.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={vacancy.isActive ? "default" : "secondary"} className="rounded-full">
                          {vacancy.isActive ? "Faol" : "Nofaol"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{vacancy.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggle(vacancy.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label={vacancy.isActive ? "Vakansiyani o‘chirish" : "Vakansiyani yoqish"}
                          >
                            {vacancy.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(vacancy.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                            aria-label="Vakansiyani o‘chirish"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {vacancies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Hozircha vakansiyalar yo‘q. &quot;Yangi vakansiya&quot; orqali qo‘shing.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Yangi vakansiya</DialogTitle>
              <DialogDescription>Filial uchun yangi vakansiya yaratish</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Lavozim</Label>
                <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lavozimni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((jt) => (
                      <SelectItem key={jt.id} value={jt.id}>{jt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-desc">Tavsif</Label>
                <Textarea
                  id="v-desc"
                  placeholder="Lavozim va vazifalarni tavsiflang..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-req">Talablar</Label>
                <Textarea
                  id="v-req"
                  placeholder="Malaka va talablarni yozing..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button className="rounded-full" onClick={handleAdd}>Vakansiyani e'lon qilish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}

export default function VacanciesPage() {
  return (
    <AuthGuard requiredRole="branch_admin">
      <VacanciesContent />
    </AuthGuard>
  )
}
