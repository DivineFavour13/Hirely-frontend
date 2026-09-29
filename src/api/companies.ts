import { apiClient } from "./client";
import type { Company, CreateCompanyRequest } from "@/types/company";

export async function getCompanies(): Promise<Company[]> {
  const response = await apiClient.get<Company[]>("/companies");
  return response.data;
}

export async function createCompany(data: CreateCompanyRequest): Promise<Company> {
  const response = await apiClient.post<Company>("/companies", data);
  return response.data;
}