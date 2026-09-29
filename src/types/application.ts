export interface Application {
  id: number;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  createdAt: string;
  matchScore: number;
  interviewDate?: string;
  interviewLocation?: string;
  job: {
    id: number;
    title: string;
  };
  applicant: {
    id: number;
    name: string;
    email: string;
  };
}