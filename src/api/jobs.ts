import { apiClient } from "./client";
import type { Job, CreateJobRequest, UpdateJobRequest, EmploymentType, JobStatus } from "@/types/job";

export async function getJobs(): Promise<Job[]> {
  const response = await apiClient.get<Job[]>("/jobs");
  return response.data;
}

export async function createJob(companyId: number, data: CreateJobRequest): Promise<Job> {
  const response = await apiClient.post<Job>(`/jobs/company/${companyId}`, data);
  return response.data;
}

export interface JobSearchParams {
  location?: string;
  employmentType?: EmploymentType;
  status?: JobStatus;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function searchJobs(params: JobSearchParams): Promise<PagedResponse<Job>> {
  const response = await apiClient.get<PagedResponse<Job>>("/jobs/search", { params });
  return response.data;
}

export async function updateJob(id: number, data: UpdateJobRequest): Promise<Job> {
  const response = await apiClient.patch<Job>(`/jobs/${id}`, data);
  return response.data;
}