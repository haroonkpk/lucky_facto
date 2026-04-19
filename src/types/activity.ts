export type ActivityType = "distribution" | "payment" | "intake";

export interface ActivityDetail {
  label: string;
  value: string | number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  amount?: number;
  date: string | Date;
  recordedBy: string;
  role?: string;
  details: ActivityDetail[];
}
