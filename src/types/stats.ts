export interface StatsResponse {
  totalCompanies: number;
  totalJobs: number;
  totalApplicants: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  jobsByStatus: Record<string, number>;
}