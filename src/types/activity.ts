export type ActivityType = "NOTE" | "STATUS_CHANGE";

export interface Activity {
  id: number;
  type: ActivityType;
  content: string;
  createdByEmail: string;
  createdAt: string;
}