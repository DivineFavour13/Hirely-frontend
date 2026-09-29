export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobStatus = "DRAFT" | "OPEN" | "CLOSED";

export interface Job {
  id: number;
  title: string;
  description?: string;
  requirements?: string;
  minSalary?: number;
  maxSalary?: number;
  employmentType?: EmploymentType;
  status: JobStatus;
  postedDate: string;
  deadline?: string;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
}

export interface CreateJobRequest {
  title: string;
  description?: string;
  requirements?: string;
  minSalary?: number;
  maxSalary?: number;
  employmentType?: EmploymentType;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  requirements?: string;
  minSalary?: number;
  maxSalary?: number;
  employmentType?: EmploymentType;
  status?: JobStatus;
}