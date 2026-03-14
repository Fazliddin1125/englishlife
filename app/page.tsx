import { Navbar } from "@/components/navbar"
import { CareersHero } from "@/components/careers-hero"
import { CompanyValues } from "@/components/company-values"
import { VacancyBoard } from "@/components/vacancy-board"
import { TalentPoolForm } from "@/components/talent-pool-form"
import { Footer } from "@/components/footer"
import { fetchVacancies } from "@/actions/vacancy.action"



export default async function CareersPage() {
  const { vacancies } = await fetchVacancies()
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative">
        <CareersHero />
        <CompanyValues />
        <VacancyBoard vacancies={vacancies} />
        <TalentPoolForm />
      </main>
      <Footer />
    </div>
  )
}
