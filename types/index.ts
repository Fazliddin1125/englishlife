/**
 * User roli uchun turlar
 */
export type UserRole = "user" | "admin" | "superadmin";

/**
 * Filial (Branch) ma'lumotlari
 */
export interface IBranch {
  _id: string;
  name: string;
}

/**
 * Kasb/Lavozim (Job) ma'lumotlari
 */
export interface IJob {
  id: string;
  name: string;
}

/**
 * Foydalanuvchi (User) ma'lumotlari
 */
export interface IUser {
  id: string;
  username: string;
  fullname?: string;
  tg_username?: string;
  role: UserRole;
  createdAt?: string | Date;
}

/**
 * Vakansiya (Vacancy) ma'lumotlari
 * Bu interface'da branch, job va owner'ni ham ID (string), 
 * ham ob'ekt (populate qilingan holat) sifatida ishlatish mumkin.
 */
export interface IVacancy {
  vacancy: null;
  _id: string;
  title: string;
  description: string;
  // Odatda API'dan kelganda bular ob'ekt shaklida keladi
  branch: IBranch; 
  job: IJob ;
  owner: IUser;
  status: boolean;
  requirments?: string[];
  offers?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;  
  parttime?: boolean;
  online?: boolean;
}

/** Backend Application modeli (candidate / ariza) */
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface IApplication {
  _id: string;
  vacancy?: { _id: string; title?: string; branch?: { name: string }; job?: { name: string } } | string | null;
  photo?: string;
  name: string;
  age: number;
  phone: string;
  university?: string;
  lastwork?: string;
  motivationLetter?: string;
  hasCertificate: boolean;
  certificate?: string;
  certificateUrls?: string[];
  maried: boolean;
  ielts?: string;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
} 