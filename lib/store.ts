// In-memory data store for EnglishLife HR System
// This simulates a backend. All state is managed here and can be easily replaced with Prisma/Supabase.

export type Role = "super_admin" | "branch_admin" | "user"

export interface Branch {
  id: string
  name: string
  address: string
  createdAt: string
}

export interface JobTitle {
  id: string
  name: string
  createdAt: string
}

export interface Vacancy {
  id: string
  branchId: string
  jobTitleId: string
  description: string
  requirements: string
  isActive: boolean
  createdAt: string
}

export type CandidateStatus = "waiting" | "accepted" | "rejected" | "interview"

export interface Candidate {
  id: string
  fullName: string
  phone: string
  age: number
  education: string
  hasCertificate: boolean
  certificateName?: string
  ieltsScore: string
  photoFileName: string
  resumeFileName: string
  desiredRole: string
  level: string
  motivationLetter?: string
  vacancyId: string | null // null = talent pool / zahira
  branchId: string | null
  contacted: boolean
  status: CandidateStatus
  feedback: string
  appliedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  password: string
  role: Role
  branchId: string | null // null for super_admin
}

// --- Initial Data ---

const initialBranches: Branch[] = [
  { id: "b1", name: "Chilonzor Branch", address: "Chilonzor, Tashkent", createdAt: "2025-01-15" },
  { id: "b2", name: "Yunusobod Branch", address: "Yunusobod, Tashkent", createdAt: "2025-02-10" },
  { id: "b3", name: "Sergeli Branch", address: "Sergeli, Tashkent", createdAt: "2025-03-05" },
]

const initialJobTitles: JobTitle[] = [
  { id: "jt1", name: "IELTS Specialist Instructor", createdAt: "2025-01-10" },
  { id: "jt2", name: "Branch Administrator", createdAt: "2025-01-12" },
  { id: "jt3", name: "General English Teacher", createdAt: "2025-01-14" },
  { id: "jt4", name: "Academic Manager", createdAt: "2025-01-16" },
  { id: "jt5", name: "Course Consultant", createdAt: "2025-01-18" },
  { id: "jt6", name: "Remote Speaking Tutor", createdAt: "2025-01-20" },
  { id: "jt7", name: "SMM Manager", createdAt: "2025-01-22" },
  { id: "jt8", name: "Receptionist", createdAt: "2025-01-24" },
]

const initialVacancies: Vacancy[] = [
  {
    id: "v1",
    branchId: "b1",
    jobTitleId: "jt1",
    description: "Join our IELTS team! We are seeking a dedicated IELTS instructor with high target IELTS scores. Requires experience in academic English and a strong track record.",
    requirements: "IELTS 8.0+, 2+ years experience, CELTA preferred",
    isActive: true,
    createdAt: "2025-06-01",
  },
  {
    id: "v2",
    branchId: "b2",
    jobTitleId: "jt2",
    description: "We're looking for an organized and efficient Branch Administrator focused on enrollment, front desk and scheduling. Manages enrollment and records.",
    requirements: "Fluent in Uzbek and Russian, basic English, organizational skills",
    isActive: true,
    createdAt: "2025-06-10",
  },
  {
    id: "v3",
    branchId: "b1",
    jobTitleId: "jt3",
    description: "Teach engaging courses to students of all age groups. Focus on speaking skills and interactive learning methodologies.",
    requirements: "IELTS 7.0+, teaching certificate, experience with mixed levels",
    isActive: true,
    createdAt: "2025-06-15",
  },
  {
    id: "v4",
    branchId: "b3",
    jobTitleId: "jt4",
    description: "Lead our academic team across all branches. Develop teaching quality, develop curriculum, and mentor our teaching staff.",
    requirements: "5+ years teaching/management experience, DELTA preferred",
    isActive: true,
    createdAt: "2025-06-05",
  },
  {
    id: "v5",
    branchId: "b2",
    jobTitleId: "jt5",
    description: "Help prospective students find the right learning path. Strong communication and sales skills needed.",
    requirements: "Sales experience, fluent English, customer-oriented mindset",
    isActive: true,
    createdAt: "2025-06-12",
  },
  {
    id: "v6",
    branchId: "b1",
    jobTitleId: "jt6",
    description: "Conduct 1-on-1 speaking classes remotely. Flexible hours from the comfort of your home. Must be available on flexible schedule.",
    requirements: "Native-level English, reliable internet, teaching experience",
    isActive: true,
    createdAt: "2025-06-18",
  },
  {
    id: "v7",
    branchId: "b1",
    jobTitleId: "jt8",
    description: "Friendly receptionist needed for front desk operations.",
    requirements: "Fluent in Uzbek and Russian, basic English, customer service experience",
    isActive: false,
    createdAt: "2025-05-20",
  },
]

const initialCandidates: Candidate[] = [
  {
    id: "c1",
    fullName: "Aziza Karimova",
    phone: "+998 90 123 4567",
    age: 26,
    education: "Toshkent Davlat Jahon Tillari Universiteti",
    hasCertificate: true,
    certificateName: "CELTA",
    ieltsScore: "7.5",
    photoFileName: "aziza_photo.jpg",
    resumeFileName: "aziza_cv.pdf",
    desiredRole: "IELTS Specialist Instructor",
    level: "IELTS 7.5 | 3 yrs exp",
    vacancyId: "v1",
    branchId: "b1",
    contacted: true,
    status: "interview",
    feedback: "Strong candidate, scheduled for demo lesson.",
    appliedAt: "2025-06-05",
  },
  {
    id: "c2",
    fullName: "Bobur Toshmatov",
    phone: "+998 91 234 5678",
    age: 24,
    education: "Toshkent Moliya Instituti",
    hasCertificate: false,
    ieltsScore: "6.0",
    photoFileName: "bobur_photo.jpg",
    resumeFileName: "bobur_resume.pdf",
    desiredRole: "Branch Administrator",
    level: "2 yrs admin experience",
    vacancyId: "v2",
    branchId: "b2",
    contacted: false,
    status: "waiting",
    feedback: "",
    appliedAt: "2025-06-12",
  },
  {
    id: "c3",
    fullName: "Dilnoza Rahimova",
    phone: "+998 93 345 6789",
    age: 23,
    education: "Samarqand Davlat Chet Tillar Instituti",
    hasCertificate: true,
    certificateName: "TESOL",
    ieltsScore: "6.5",
    photoFileName: "dilnoza_photo.jpg",
    resumeFileName: "dilnoza_cv.pdf",
    desiredRole: "General English Teacher",
    level: "IELTS 6.5 | 1 yr exp",
    vacancyId: null,
    branchId: null,
    contacted: false,
    status: "waiting",
    feedback: "",
    motivationLetter: "I am passionate about teaching and would love to join EnglishLife.",
    appliedAt: "2025-06-15",
  },
  {
    id: "c4",
    fullName: "Jasur Aliyev",
    phone: "+998 94 456 7890",
    age: 32,
    education: "Westminster International University",
    hasCertificate: true,
    certificateName: "DELTA",
    ieltsScore: "8.0",
    photoFileName: "jasur_photo.jpg",
    resumeFileName: "jasur_cv.pdf",
    desiredRole: "Academic Manager",
    level: "5 yrs management exp",
    vacancyId: "v1",
    branchId: "b1",
    contacted: true,
    status: "rejected",
    feedback: "Not enough management experience.",
    appliedAt: "2025-06-08",
  },
]

const initialAdmins: AdminUser[] = [
  {
    id: "a1",
    name: "Super Admin",
    email: "admin@englishlife.uz",
    password: "admin123",
    role: "super_admin",
    branchId: null,
  },
  {
    id: "a2",
    name: "Chilonzor Admin",
    email: "chilonzor@englishlife.uz",
    password: "branch123",
    role: "branch_admin",
    branchId: "b1",
  },
  {
    id: "a3",
    name: "Yunusobod Admin",
    email: "yunusobod@englishlife.uz",
    password: "branch123",
    role: "branch_admin",
    branchId: "b2",
  },
]

// --- Mutable State ---

let branches = [...initialBranches]
let jobTitles = [...initialJobTitles]
let vacancies = [...initialVacancies]
let candidates = [...initialCandidates]
let admins = [...initialAdmins]

// --- Helper ---
function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

// --- Branch CRUD ---
export function getBranches(): Branch[] {
  return branches
}

export function addBranch(name: string, address: string): Branch {
  const branch: Branch = { id: generateId(), name, address, createdAt: new Date().toISOString().slice(0, 10) }
  branches = [...branches, branch]
  return branch
}

export function deleteBranch(id: string) {
  branches = branches.filter((b) => b.id !== id)
}

// --- Job Title CRUD ---
export function getJobTitles(): JobTitle[] {
  return jobTitles
}

export function addJobTitle(name: string): JobTitle {
  const jt: JobTitle = { id: generateId(), name, createdAt: new Date().toISOString().slice(0, 10) }
  jobTitles = [...jobTitles, jt]
  return jt
}

export function deleteJobTitle(id: string) {
  jobTitles = jobTitles.filter((jt) => jt.id !== id)
}

// --- Vacancy CRUD ---
export function getVacancies(): Vacancy[] {
  return vacancies
}

export function getActiveVacancies(): Vacancy[] {
  return vacancies.filter((v) => v.isActive)
}

export function getVacanciesByBranch(branchId: string): Vacancy[] {
  return vacancies.filter((v) => v.branchId === branchId)
}

export function addVacancy(data: Omit<Vacancy, "id" | "createdAt">): Vacancy {
  const vacancy: Vacancy = { ...data, id: generateId(), createdAt: new Date().toISOString().slice(0, 10) }
  vacancies = [...vacancies, vacancy]
  return vacancy
}

export function toggleVacancyActive(id: string) {
  vacancies = vacancies.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
}

export function deleteVacancy(id: string) {
  vacancies = vacancies.filter((v) => v.id !== id)
}

// --- Candidate CRUD ---
export function getCandidates(): Candidate[] {
  return candidates
}

export function getCandidatesByBranch(branchId: string): Candidate[] {
  return candidates.filter((c) => c.branchId === branchId)
}

export function getTalentPoolCandidates(): Candidate[] {
  return candidates.filter((c) => c.vacancyId === null)
}

export function addCandidate(data: Omit<Candidate, "id" | "contacted" | "status" | "feedback" | "appliedAt" | "level"> & { level?: string }): Candidate {
  const candidate: Candidate = {
    ...data,
    level: data.level || `IELTS ${data.ieltsScore} | ${data.education}`,
    id: generateId(),
    contacted: false,
    status: "waiting",
    feedback: "",
    appliedAt: new Date().toISOString().slice(0, 10),
  }
  candidates = [...candidates, candidate]
  return candidate
}

export function updateCandidateContacted(id: string, contacted: boolean) {
  candidates = candidates.map((c) => (c.id === id ? { ...c, contacted } : c))
}

export function updateCandidateStatus(id: string, status: CandidateStatus) {
  candidates = candidates.map((c) => (c.id === id ? { ...c, status } : c))
}

export function updateCandidateFeedback(id: string, feedback: string) {
  candidates = candidates.map((c) => (c.id === id ? { ...c, feedback } : c))
}

// --- Auth ---
export function getAdmins(): AdminUser[] {
  return admins
}

export function authenticateAdmin(email: string, password: string): AdminUser | null {
  return admins.find((a) => a.email === email && a.password === password) || null
}

export function getBranchById(id: string): Branch | undefined {
  return branches.find((b) => b.id === id)
}

export function getJobTitleById(id: string): JobTitle | undefined {
  return jobTitles.find((jt) => jt.id === id)
}

export function getVacancyById(id: string): Vacancy | undefined {
  return vacancies.find((v) => v.id === id)
}
