export type GameStatus = 'vydane' | 'vo_vyvoji' | 'early_access' | 'oznamene';
export type JobDepartment = 'programovanie' | 'art_animacie' | 'dizajn' | 'produkcia';
export type Seniority = 'Senior' | 'Medior' | 'Junior';
export type InquiryType = 'co_development' | 'publishing' | 'press' | 'ine';

export interface GameScreenshot {
  id: number;
  image_url: string;
  caption: string;
  display_order: number;
}

export interface GameSummary {
  id: number;
  title: string;
  tagline: string;
  slug: string;
  status: GameStatus;
  status_label: string;
  genre: string;
  engine_used: string;
  platforms: string[];
  release_date_label: string;
  steam_url: string;
  awards: string[];
  cover_image_url: string;
  hero_banner_url: string;
  is_featured: boolean;
  display_order: number;
}

export interface GameDetail extends GameSummary {
  trailer_url: string;
  synopsis: string;
  key_features: string[];
  screenshots: GameScreenshot[];
}

export interface StudioService {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  deliverables: string[];
  engines_supported: string[];
  display_order: number;
}

export interface JobOpening {
  id: number;
  title: string;
  department: JobDepartment;
  department_label: string;
  location: string;
  seniority: Seniority;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_from_eur: number;
  created_at: string;
}

export interface JobApplicationPayload {
  job: number;
  applicant_name: string;
  email: string;
  phone: string;
  portfolio_url: string;
  cover_note: string;
  gdpr_consent: boolean;
}

export interface BusinessInquiryPayload {
  inquiry_type: InquiryType;
  company_name: string;
  contact_name: string;
  email: string;
  budget_or_scope: string;
  message: string;
  gdpr_consent: boolean;
}

/** DRF validation error body: field name → list of messages. */
export type ApiValidationErrors = Record<string, string[] | string>;
