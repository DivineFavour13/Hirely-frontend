export interface Applicant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  skills?: string;
  experienceSummary?: string;
  createdAt: string;
}

export interface CreateApplicantRequest {
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  skills?: string;
  experienceSummary?: string;
}