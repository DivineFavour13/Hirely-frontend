import { apiClient } from "./client";
import type { Applicant, CreateApplicantRequest } from "@/types/applicant";

export async function getApplicants(): Promise<Applicant[]> {
  const response = await apiClient.get<Applicant[]>("/applicants");
  return response.data;
}

export async function createApplicant(data: CreateApplicantRequest): Promise<Applicant> {
  const response = await apiClient.post<Applicant>("/applicants", data);
  return response.data;
}

export async function exportApplicationsCSV(): Promise<Blob> {
  const response = await apiClient.get("/applications/export", {
    responseType: "blob",
  });
  return response.data;
}