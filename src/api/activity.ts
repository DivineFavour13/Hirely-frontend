import { apiClient } from "./client";
import type { Activity } from "@/types/activity";

export async function getActivity(applicationId: number): Promise<Activity[]> {
  const response = await apiClient.get<Activity[]>(`/applications/${applicationId}/activity`);
  return response.data;
}

export async function addNote(applicationId: number, content: string): Promise<Activity> {
  const response = await apiClient.post<Activity>(`/applications/${applicationId}/notes`, { content });
  return response.data;
}