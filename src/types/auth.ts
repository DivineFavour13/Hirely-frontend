export type Role = "ADMIN" | "COMPANY_REP" | "APPLICANT";

export interface AuthResponse {
  token: string;
  email: string;
  role: Role;
  applicantId: number | null;
  companyId: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  companyId?: number;
  applicantId?: number;
}