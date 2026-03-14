"use client"

import { useState } from "react"
import { Phone, FileText, Search, GraduationCap, Award, User } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  updateCandidateContacted,
  updateCandidateStatus,
  updateCandidateFeedback,
  type Candidate,
  type CandidateStatus,
} from "@/lib/store"

const STATUS_OPTIONS: { value: CandidateStatus; label: string }[] = [
  { value: "waiting", label: "Waiting" },
  { value: "interview", label: "Interview" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

function statusBadgeClass(status: CandidateStatus) {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-700 border-green-200"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200"
    case "interview":
      return "bg-blue-50 text-blue-700 border-blue-200"
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
  }
}

export function CandidateTable({
  initialCandidates,
  title = "Candidates",
}: {
  initialCandidates: Candidate[]
  title?: string
}) {
  const [candidates, setCandidates] =
    useState<Candidate[]>(initialCandidates)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.desiredRole.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.level.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleContactedChange(id: string, checked: boolean) {
    updateCandidateContacted(id, checked)
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, contacted: checked } : c))
    )
  }

  function handleStatusChange(id: string, status: CandidateStatus) {
    updateCandidateStatus(id, status)
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
  }

  function handleFeedbackChange(id: string, feedback: string) {
    updateCandidateFeedback(id, feedback)
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, feedback } : c))
    )
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          {title} ({filtered.length})
        </CardTitle>
        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ism, rol, telefon, daraja..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border-0 bg-secondary pl-10"
            />
          </div>
          {/* Pill status filter */}
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
            <button
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
                <TableHead className="w-[220px]">Nomzod</TableHead>
                <TableHead>Lavozim</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {"Ta'lim / IELTS"}
                  </span>
                </TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Sertifikat
                  </span>
                </TableHead>
                <TableHead>Sana</TableHead>
                <TableHead className="text-center">
                  {"Bog'landim"}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[200px]">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  className={candidate.contacted ? "bg-accent/30" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {candidate.fullName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {candidate.phone}
                          </span>
                          {candidate.age > 0 && (
                            <span>{candidate.age} yosh</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {candidate.desiredRole}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="block text-xs text-foreground">
                        {candidate.education || "Noaniq"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        IELTS: {candidate.ieltsScore || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {candidate.hasCertificate ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <Award className="h-3 w-3" />
                        {candidate.certificateName || "Bor"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Yo&apos;q
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {candidate.appliedAt}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={candidate.contacted}
                        onCheckedChange={(checked) =>
                          handleContactedChange(
                            candidate.id,
                            !!checked
                          )
                        }
                        aria-label={`Mark ${candidate.fullName} as contacted`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={candidate.status}
                      onValueChange={(val) =>
                        handleStatusChange(
                          candidate.id,
                          val as CandidateStatus
                        )
                      }
                    >
                      <SelectTrigger
                        className={`h-8 w-[130px] rounded-full border text-xs font-medium ${statusBadgeClass(candidate.status)}`}
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
                    <Textarea
                      placeholder="Izoh qo'shing..."
                      value={candidate.feedback}
                      onChange={(e) =>
                        handleFeedbackChange(
                          candidate.id,
                          e.target.value
                        )
                      }
                      rows={2}
                      className="min-h-0 resize-none text-sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
  )
}
