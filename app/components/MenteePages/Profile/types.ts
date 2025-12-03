export type Theme = "dark" | "light";

export type ApiUser = {
  _id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  short_bio?: string;
  phoneNumber?: string;
  Country?: string;
};

export type ApiMentee = {
  _id: string;
  user: string;
  overall_score: number;
  total_interviews: number;
  points_earned: number;
  joined_date?: string;
  active: boolean;
  phone?: string;
  location?: string;
  education?: string;
  company?: string;
  skills?: { name: string; level: number; samples?: number; updated_at?: string }[];
  time_invested_minutes?: number;
};

export type Activity = {
  _id: string;
  type: string;
  title: string;
  score?: number | null;
  timestamp: string;
};
