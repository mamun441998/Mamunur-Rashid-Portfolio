export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string; // "Laravel, Next.js, PostgreSQL"
  image_url?: string | null;
  project_url?: string | null;
  github_url?: string | null;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  description: string;
  start_date: string; // ISO date string e.g., "2025-12-01"
  end_date?: string | null;
  is_current: boolean;
}