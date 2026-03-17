import { getVacancyDetail } from "@/actions/vacancy.action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Clock, Users, 
  Briefcase, CheckCircle2, GraduationCap 
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import VacancyApplicationForm from "@/components/vacancy-application-form";
import { Footer } from "@/components/footer";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VacancyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vacancy = await getVacancyDetail(id);
  
  if (!vacancy) {
    return notFound();
  }

  // Backend'dan kelayotgan ma'lumotlarni rasmga moslashtiramiz
  const jobTitle = vacancy.job?.name || vacancy.title;
  const branchName = vacancy.branch?.name || "Noma'lum filial";
  

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative bg-[#E11D48] pt-28 pb-20 overflow-hidden">
        {/* Orqa fondagi yengil effektlar */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48] via-[#E11D48] to-[#BE123C]" />
        
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <Link
            href="/#vacancies"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" /> Barcha vakansiyalar
          </Link>

          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-tight">
            {vacancy.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-white/90">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-70" /> {branchName} fillial
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" /> {!vacancy.parttime ? "Erkin grafik" : "To'liq ish kuni"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 opacity-70" /> {vacancy.online ? "Masofadan" : "Ofisda"}  
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-12 lg:px-8">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Vakansiya haqida */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-gray-900">
                <Briefcase className="h-5 w-5 text-[#E11D48]" /> Vakansiya haqida
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-600">
                {vacancy.description}
              </p>
            </div>

            {/* Talablar */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-[#E11D48]" /> Talablar
              </h2>
              <ul className="space-y-4">
                {vacancy.requirments && vacancy?.requirments.length > 0 ? (
                  vacancy.requirments.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E11D48]" />
                      {req.trim()}
                    </li>
                  ))  
                ) : (
                  <li className="text-gray-400 italic">Ma'lumot kiritilmagan</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md sm:p-10">
              
              
              <VacancyApplicationForm 
                vacancy={vacancy} 
                jobName={jobTitle}
                branchName={branchName} 
              />    
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}