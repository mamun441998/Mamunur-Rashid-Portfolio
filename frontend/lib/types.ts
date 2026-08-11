// Shared types mirroring the FastAPI backend models.

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string; // "Laravel, Next.js, PostgreSQL"
  image_url?: string | null;
  project_url?: string | null;
  github_url?: string | null;
  created_at?: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  description: string;
  start_date: string; // ISO date string e.g. "2025-12-01"
  end_date?: string | null;
  is_current: boolean;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon_name: string;
  features: string; // comma-separated
  tech_stack: string; // comma-separated
  highlight: boolean;
  order: number;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  challenge: string;
  github_repo_url?: string | null;
  metrics: string; // JSON string of CaseStudyMetric[]
  code_snippet: string;
  order: number;
}

export type LeadStatus = "new" | "contacted" | "meeting" | "closed";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  status: LeadStatus;
  created_at: string;
  updated_at?: string | null;
}

export interface ContactStats {
  total: number;
  unread: number;
  new: number;
  contacted: number;
  meeting: number;
  closed: number;
}

export interface SiteSetting {
  id: number;
  full_name: string;
  role_title: string;
  hero_tagline: string;
  about_text: string;
  profile_image_url: string;
  resume_url: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  years_experience: string;
  projects_completed: string;
  happy_clients: string;
  satisfaction: string;
  calendly_url: string;
}

export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  hero_image_url?: string | null;
  tags: string;              // comma-separated
  meta_description: string;
  author: string;
  read_time: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar_url?: string | null;
  quote: string;
  rating: number;
  featured: boolean;
  order: number;
  created_at?: string;
}

// ---- Client Portal ----
export interface PortalClient {
  id: number;
  name: string;
  email: string;
  company: string;
  project_title: string;
  project_description: string;
  status: string;        // active | on_hold | completed
  progress: number;      // 0..100
  meeting_url: string;
  proposal_text: string;
  next_steps: string;
  created_at?: string;
}

export interface Milestone {
  id: number;
  client_id: number;
  title: string;
  status: string;        // pending | in_progress | done
  order: number;
}

export interface ClientUpdate {
  id: number;
  client_id: number;
  title: string;
  body: string;
  author: string;        // "owner" | "client"
  created_at: string;
}

export interface PortalFileMeta {
  id: number;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

export interface Invoice {
  id: number;
  client_id: number;
  title: string;
  amount: number;
  currency: string;
  status: string;        // due | paid
  due_date?: string | null;
  created_at?: string;
}

export interface PortalDashboard {
  client: PortalClient;
  milestones: Milestone[];
  updates: ClientUpdate[];
  files: PortalFileMeta[];
  invoices: Invoice[];
}

export interface Meeting {
  id: number;
  invitee_name: string;
  invitee_email: string;
  event_name: string;
  scheduled_at?: string | null;
  status: string;
  calendly_event_uri?: string | null;
  calendly_invitee_uri?: string | null;
  location: string;
  notes: string;
  created_at: string;
}

export interface GoogleMeeting {
  id: string;
  event_name: string;
  invitee_name: string;
  invitee_email: string;
  scheduled_at?: string | null;
  end_at?: string | null;
  location: string;
  meet_link: string;
  notes: string;
  status: string;        // from iCal: active / canceled
  state?: string;        // admin pipeline: pending / completed / closed
}

export type MeetingState = "pending" | "completed" | "closed";

export interface MeetingsResponse {
  configured: boolean;
  error?: string;
  meetings: GoogleMeeting[];
}

export interface CountryCount {
  country: string;
  country_code: string;
  count: number;
}

export interface DayCount {
  day: string;
  count: number;
}

export interface PathCount {
  path: string;
  count: number;
}

export interface AnalyticsStats {
  total_visits: number;
  unique_visitors: number;
  today: number;
  this_week: number;
  by_country: CountryCount[];
  by_day: DayCount[];
  top_paths: PathCount[];
}
