"use client"

import React, { useState } from "react"
import { CheckCircle2, Upload, Camera, GraduationCap, Award, Building, University } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { IVacancy } from "@/types"
import { Textarea } from "./ui/textarea"

type Props = {
  vacancy: IVacancy
  jobName: string
  branchName: string
}

export default function VacancyApplicationForm({ vacancy, jobName, branchName }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [photoError, setPhotoError] = useState<string>("")
  const [certError, setCertError] = useState<string>("")
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);

  const photoFile = fd.get("photo") as File;
  if (!photoFile || !photoFile.size) {
    setPhotoError("Rasm yuklash majburiy");
    return;
  }
  setPhotoError("");

  // Agar sertifikat bor deb belgilansa, kamida 1 ta rasm sertifikat kerak
  const certInput = (e.currentTarget.querySelector(
    'input[name="certificate"]'
  ) as HTMLInputElement | null)
  if (hasCertificate) {
    const files = certInput?.files
    if (!files || files.length === 0) {
      setCertError("Sertifikat rasm(lar)ini yuklash majburiy");
      return;
    }
  }
  setCertError("")
  setIsLoading(true);

  const dataToSend = new FormData();
  
  // Ma'lumotlarni yig'ish
  dataToSend.append("vacancy", vacancy._id);
  dataToSend.append("name", fd.get("fullName") as string);
  dataToSend.append("age", fd.get("age") as string);
  dataToSend.append("phone", fd.get("phone") as string);
  dataToSend.append("university", fd.get("education") as string);
  dataToSend.append("lastwork", (fd.get("lastwork") as string) || "");
  dataToSend.append("hasCertificate", String(hasCertificate));
  dataToSend.append("certificate", String(fd.get("certificateName") || ""));
  dataToSend.append("maried", fd.get("maritalStatus") === "maried" ? "true" : "false");
  dataToSend.append("ielts", (fd.get("ieltsScore") as string) || "");

  if (photoFile.size) {
    dataToSend.append("photo", photoFile);
  }

  if (certInput?.files) {
    for (let i = 0; i < certInput.files.length; i++) {
      dataToSend.append("certificate", certInput.files[i]);
    }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/apply`, {
      method: "POST",
      // DIQQAT: headers ichida Content-Type yozmang!
      body: dataToSend, // JSON emas, FormData yuboramiz
    });

    if (res.ok) {
      setSubmitted(true);
    }
  } catch (error) {
    console.error("Xato:", error);
  } finally {
    setIsLoading(false);
  }
}

  if (submitted)
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Arizangiz qabul qilindi!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">Rahmat! Tez orada siz bilan bog'lanamiz. Omad tilaymiz!</p>
        <Link href="/">
          <Button className="mt-4 rounded-full">Bosh sahifaga qaytish</Button>
        </Link>
      </div>
    )

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Ariza topshirish</h2>
        <p className="mt-1 text-sm text-muted-foreground">Quyidagi ma'lumotlarni to'ldiring</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-secondary">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <input type="file" name="photo" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">Rasmingizni yuklang</p>
            <p className="text-xs text-muted-foreground">JPG, PNG formatda, 2MB gacha</p>
            {photoError && (
              <p className="mt-1 text-xs text-destructive">{photoError}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ism Familiya</Label>
            <Input id="fullName" name="fullName" placeholder="To'liq ismingiz" className="rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Yoshingiz</Label>
            <Input id="age" name="age" type="number" min={18} max={60} placeholder="25" className="rounded-xl" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon raqam</Label>
          <Input id="phone" name="phone" placeholder="+998 XX XXX XXXX" className="rounded-xl" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" /> Qayerda o&apos;qigansiz?
          </Label>
          <Input id="education" name="education" placeholder="Universitet/Kollej nomi" className="rounded-xl" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastwork" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" /> Eski ish joyi va tajribangiz?
          </Label>
          <Textarea id="lastwork" name="lastwork" placeholder="Eski ish joyi nomi va lavozim, tajriba/ Ishlamagan" className="rounded-xl" required />
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <Checkbox id="hasCertificate" checked={hasCertificate} onCheckedChange={(checked) => setHasCertificate(checked === true)} />
            <Label htmlFor="hasCertificate" className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <Award className="h-4 w-4 text-primary" /> Sertifikatim bor
            </Label>
          </div>
          {hasCertificate && (
            <>
              <Input name="certificateName" placeholder="Sertifikat nomi (CELTA, IELTS...)" className="rounded-xl" />
              <div className="space-y-1">
                <Label className="text-sm">Sertifikat fayl(lar) – JPG, PNG (2 ta bo‘lsa ikkalasini yuklang)</Label>
                <Input name="certificate" type="file" accept=".jpg,.jpeg,.png" multiple className="rounded-xl" />
                {certError && (
                  <p className="mt-1 text-xs text-destructive">{certError}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Oilaviy holat</Label>
          <Select name="maritalStatus" required>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Holat tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="married" value="married">Turmush qurgan</SelectItem>
              <SelectItem key="single" value="single">Turmush qurmagan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ieltsScore">IELTS ballingiz</Label>
          <Select name="ieltsScore" required>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Ball tanlang" />
            </SelectTrigger>
            <SelectContent>
              {["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"].map((score) => (
                <SelectItem key={score} value={score}>{score}</SelectItem>
              ))}
              <SelectItem value="Yo'q">Topshirmagan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="resume">CV yuklash</Label>
          <div className="relative">
            <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" className="rounded-xl file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">PDF, DOC formatda</p>
        </div> */}

        <Button type="submit" size="lg" className="w-full gap-2 rounded-full text-base">
          <Upload className="h-4 w-4" /> {isLoading ? "Yuborilmoqda..." : "Arizani yuborish"}
        </Button>
      </form>
    </>
  )
}
