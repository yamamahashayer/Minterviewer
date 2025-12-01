// app/components/MenteeCV/create/types.ts

export type StepKey =
  | "type"
  | "target"
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "projects"  
  | "summary"
  | "preview";

export type StepMeta = { key: StepKey; title: string; icon: any };

export type CvType = "general" | "role" | "job";

export type Experience = {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: number;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
};

export type Skills = {
  technical: string;
  soft: string;
  languages: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  github?: string;
  link?: string;
};

export type Personal = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string; 
  summary: string;
};

// ----- الـ CVData الرئيسي -----
export type CVData = {
  personal: Personal;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];     // ✅ المشاريع هنا
};

// ----- خيارات أدوار جاهزة -----
export const ROLE_OPTIONS = [
  "Frontend Developer", "Backend Developer", "Full-Stack Engineer", "Mobile Developer",
  "Data Analyst", "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Engineer",
  "QA Engineer", "Product Manager", "UI/UX Designer", "Other",
] as const;

export type RoleOption = typeof ROLE_OPTIONS[number];
