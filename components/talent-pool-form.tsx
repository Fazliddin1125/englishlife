"use client"

import React, { useState } from "react"
import {
  UserPlus,
  Send,
  CheckCircle2,
  Camera,
  GraduationCap,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/dialog"
import { submitTalentPoolApplication } from "@/actions/application.action"
import { toast } from "sonner"

async function fetchJobTitles(): Promise<{ _id: string; name: string }[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/get/job`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data.jobs ?? []
  } catch {
    return []
  }
}

export function TalentPoolForm() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [desiredRole, setDesiredRole] = useState("")
  const [ieltsScore, setIeltsScore] = useState("")
  const [hasCertificate, setHasCertificate] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [jobTitles, setJobTitles] = useState<{ _id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [certError, setCertError] = useState<string>("")
  const [photoError, setPhotoError] = useState<string>("")

  React.useEffect(() => {
    fetchJobTitles().then(setJobTitles)
  }, [open])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const photoFile = fd.get("photo") as File
    if (!photoFile || !photoFile.size) {
      setPhotoError("Rasm yuklash majburiy")
      return
    }
    setPhotoError("")

    const certInput = e.currentTarget.querySelector(
      'input[name="certificate"]'
    ) as HTMLInputElement | null
    if (hasCertificate) {
      const files = certInput?.files
      if (!files || files.length === 0) {
        setCertError("Sertifikat rasm(lar)ini yuklash majburiy")
        return
      }
    }
    setCertError("")

    const dataToSend = new FormData()
    dataToSend.append("name", (fd.get("fullName") as string) || "")
    dataToSend.append("age", (fd.get("age") as string) || "")
    dataToSend.append("phone", (fd.get("phone") as string) || "")
    dataToSend.append("university", (fd.get("education") as string) || "")
    dataToSend.append("lastwork", [desiredRole, (fd.get("motivation") as string) || ""].filter(Boolean).join(". ") || "")
    dataToSend.append("motivationLetter", (fd.get("motivation") as string) || "")
    dataToSend.append("hasCertificate", String(hasCertificate))
    dataToSend.append("certificate", hasCertificate ? (fd.get("certificateName") as string) || "" : "")
    dataToSend.append("maried", "false")
    dataToSend.append("ielts", ieltsScore || "")
    if (photoFile.size) {
      dataToSend.append("photo", photoFile)
    }
    if (certInput?.files) {
      for (let i = 0; i < certInput.files.length; i++) {
        dataToSend.append("certificate", certInput.files[i])
      }
    }
    setLoading(true)
    try {
      const ok = await submitTalentPoolApplication(dataToSend)
      if (ok) {
        setSubmitted(true)
      } else {
        toast.error("Ariza yuborishda xato. Qaytadan urinib ko'ring.")
      }
    } catch {
      toast.error("Tarmoq xatosi.")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setDesiredRole("")
    setIeltsScore("")
    setHasCertificate(false)
    setPhotoPreview(null)
  }

  return (
    <>
      <section
        id="zahira"
        className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy/95 py-24 lg:py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, hsl(var(--primary) / 0.1) 0%, transparent 40%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-navy-foreground sm:text-4xl lg:text-5xl animate-fade-in-up">
            Mos vakansiya topmadingizmi?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-pretty text-lg text-navy-foreground/70">
            Biz doimo rivojlanib, yangi insonlarni jamoamizga qo‘shib bormoqdamiz. Zahira uchun ariza qoldiring — imkoniyat paydo bo‘lganda siz bilan bog‘lanamiz.
          </p>
          <Button
            size="lg"
            className="mt-10 gap-2 rounded-full bg-primary px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 animate-glow-pulse"
            onClick={() => {
              setOpen(true)
              resetForm()
            }}
          >
            Zahira uchun ariza berish
          </Button>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) resetForm()
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <UserPlus className="h-4 w-4 text-primary-foreground" />
              </div>
              Zahira uchun ariza
            </DialogTitle>
            <DialogDescription>
              {"Ma'lumotlaringizni qoldiring va mos vakansiya paydo bo'lganda biz siz bilan bog'lanamiz."}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {"Arizangiz qabul qilindi!"}
              </p>
              <p className="text-center text-sm text-muted-foreground">
                {"Rahmat! Mos vakansiya paydo bo'lganda biz siz bilan bog'lanamiz."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">
                    Rasmingizni yuklang
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG formatda
                  </p>
                  {photoError && (
                    <p className="mt-1 text-xs text-destructive">{photoError}</p>
                  )}
                </div>
              </div>

              {/* Name & Age */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tp-name">Ism Familiya</Label>
                  <Input
                    id="tp-name"
                    name="fullName"
                    placeholder="To'liq ismingiz"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tp-age">Yoshingiz</Label>
                  <Input
                    id="tp-age"
                    name="age"
                    type="number"
                    min={18}
                    max={60}
                    placeholder="25"
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="tp-phone">Telefon raqam</Label>
                <Input
                  id="tp-phone"
                  name="phone"
                  placeholder="+998 XX XXX XXXX"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label
                  htmlFor="tp-education"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Qayerda o&apos;qigansiz?
                </Label>
                <Input
                  id="tp-education"
                  name="education"
                  placeholder="Universitet/Kollej nomi"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Certificate */}
              <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="tp-hasCert"
                    checked={hasCertificate}
                    onCheckedChange={(checked) =>
                      setHasCertificate(checked === true)
                    }
                  />
                  <Label
                    htmlFor="tp-hasCert"
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                  >
                    <Award className="h-4 w-4 text-primary" />
                    Sertifikatim bor
                  </Label>
                </div>
                {hasCertificate && (
                  <>
                    <Input
                      name="certificateName"
                      placeholder="Sertifikat nomi (CELTA, TESOL...)"
                      className="rounded-xl"
                    />
                    <div className="space-y-1">
                      <Label className="text-sm">Sertifikat fayl(lar) – JPG, PNG</Label>
                      <Input
                        name="certificate"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        className="rounded-xl"
                      />
                      {certError && (
                        <p className="mt-1 text-xs text-destructive">{certError}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* IELTS Score */}
              <div className="space-y-2">
                <Label>IELTS ballingiz</Label>
                <Select
                  value={ieltsScore}
                  onValueChange={setIeltsScore}
                  required
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Ball tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "5.0",
                      "5.5",
                      "6.0",
                      "6.5",
                      "7.0",
                      "7.5",
                      "8.0",
                      "8.5",
                      "9.0",
                    ].map((score) => (
                      <SelectItem key={score} value={score}>
                        {score}
                      </SelectItem>
                    ))}
                    <SelectItem value="Yo'q">Topshirmagan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desired Role & CV */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Qiziqtirgan lavozim</Label>
                  <Select
                    value={desiredRole}
                    onValueChange={setDesiredRole}
                    required
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Lavozim tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTitles.map((jt) => (
                        <SelectItem key={jt._id} value={jt.name}>
                          {jt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tp-resume">CV yuklash</Label>
                  <Input
                    id="tp-resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <Label htmlFor="tp-motivation">
                  Motivatsion xat (ixtiyoriy)
                </Label>
                <Textarea
                  id="tp-motivation"
                  name="motivation"
                  placeholder="Nima uchun EnglishLife jamoasiga qo'shilmoqchisiz..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 rounded-full text-base"
                size="lg"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
                {loading ? "Yuborilmoqda..." : "Ariza yuborish"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
