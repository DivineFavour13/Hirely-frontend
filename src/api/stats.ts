import { apiClient } from "./client";
import type { StatsResponse } from "@/types/stats";

export async function getStats(): Promise<StatsResponse> {
  const response = await apiClient.get<StatsResponse>("/stats");
  return response.data;
}