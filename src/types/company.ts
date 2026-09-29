export interface Company {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  location?: string;
  email?: string;
  createdAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  location?: string;
  email?: string;
}