import { apiClient } from "./client";
import type { Application, ApplicationStatus } from "@/types/application";

export async function getApplications(): Promise<Application[]> {
  const response = await apiClient.get<Application[]>("/applications");
  return response.data;
}

export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus
): Promise<Application> {
  const response = await apiClient.patch<Application>(`/applications/${id}/status`, { status });
  return response.data;
}

export async function exportApplicationsCSV(): Promise<Blob> {
  const response = await apiClient.get("/applications/export", {
    responseType: "blob",
  });
  return response.data;
}

export interface ScheduleInterviewRequest {
  interviewDate: string;
  interviewLocation?: string;
}

export async function scheduleInterview(
  id: number,
  data: ScheduleInterviewRequest
): Promise<Application> {
  const response = await apiClient.patch<Application>(`/applications/${id}/interview`, data);
  return response.data;
}