import { BaseService } from './baseService';

export interface MenteeProfile {
  github?: string;
  linkedin_url?: string;
  full_name?: string;
  email?: string;
  short_bio?: string;
  area_of_expertise?: string[];
  location?: string;
  phone?: string;
  education?: string;
  skills?: { name: string; level: number }[];
  joined_date?: string;
  company?: string;
  active?: boolean;
  phoneNumber?: string;
  Country?: string;
}

export interface Activity {
  _id: string;
  description: string;
  timestamp: string;
  type: string;
}

export interface DashboardStats {
  overallScore: number;
  totalInterviews: number;
  hoursThisWeek: number | string;
  totalHours: number | string;
  activeDays?: number;
}

export interface WeeklyData {
  day: string;
  score: number;
  time: number;
}

export interface UpcomingInterview {
  id: string;
  title: string;
  type?: string;
  time: string;
  duration: string;
}

export interface CurrentGoal {
  id: string;
  title: string;
  progress: number;
  current: number;
  target: number;
}

export interface RecentAchievement {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  date: string;
}

export interface LastInterviewFeedback {
  id: string;
  date: string;
  score: number;
  strengths: string[];
  improvements: string[];
  skills: string[];
}

export interface MonthlyData {
  month: string;
  avgScore: number;
  interviewCount: number;
  sessionHours: number;
}

export interface SkillsBreakdown {
  skill: string;
  avgScore: number;
  attempts: number;
}

export interface SessionMetrics {
  completionRate: number;
  totalBooked: number;
  totalCompleted: number;
  avgDuration: number;
}

export interface ProgressMetrics {
  improvement: number;
  consistency: number;
  currentStreak: number;
}

export interface DashboardData {
  stats: DashboardStats;
  weeklyData: WeeklyData[];
  upcomingInterviews: UpcomingInterview[];
  currentGoals: CurrentGoal[];
  recentAchievements: RecentAchievement[];
  lastInterviewFeedback?: LastInterviewFeedback | null;
  monthlyData?: MonthlyData[];
  skillsBreakdown?: SkillsBreakdown[];
  activityPattern?: any[];
  sessionMetrics?: SessionMetrics;
  progressMetrics?: ProgressMetrics;
}

export class MenteeService extends BaseService {
  async getProfile(menteeId: string): Promise<{ user: any; mentee: MenteeProfile }> {
    return this.get(`/api/mentees/${menteeId}/profile`);
  }

  async updateProfile(menteeId: string, data: Partial<MenteeProfile>): Promise<{ ok: boolean; user: any; mentee: MenteeProfile }> {
    return this.put(`/api/mentees/${menteeId}/profile`, data);
  }

  async getActivities(menteeId: string, limit: number = 8): Promise<{ items: Activity[] }> {
    return this.get(`/api/mentees/${menteeId}/activities`, { limit });
  }

  async getJobs(): Promise<{ jobs: any[] }> {
    return this.get('/api/company/jobs');
  }

  async getDashboard(): Promise<DashboardData> {
    return this.get('/api/mentee/dashboard');
  }
}

export const menteeService = new MenteeService();
