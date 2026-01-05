import { BaseService } from './baseService';

export interface MentorProfile {
  yearsOfExperience?: number;
  hourlyRate?: number;
  stripeAccountId?: string;
  focusAreas?: string[];
  availabilityType?: string;
  languages?: string[];
  sessionTypes?: string[];
  certifications?: string[];
  achievements?: string[];
  rating?: number;
  reviewsCount?: number;
  sessionsCount?: number;
  menteesCount?: number;
  short_bio?: string;
  area_of_expertise?: string;
  linkedin_url?: string;
  github?: string;
}

export interface Session {
  _id: string;
  title: string;
  mentee: { full_name: string; email: string };
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
}

export class MentorService extends BaseService {
  async getProfile(mentorId: string): Promise<{ user: any; mentor: MentorProfile }> {
    return this.get(`/api/mentors/${mentorId}/profile`);
  }

  async updateProfile(mentorId: string, data: Partial<MentorProfile>): Promise<{ ok: boolean; user: any; mentor: MentorProfile }> {
    return this.put(`/api/mentors/${mentorId}/profile`, data);
  }

  async getSessions(mentorId: string): Promise<{ sessions: Session[] }> {
    return this.get(`/api/mentors/${mentorId}/sessions`);
  }

  async getStudents(mentorId: string): Promise<{ students: any[] }> {
    return this.get(`/api/mentors/${mentorId}/students`);
  }

  async getReviews(mentorId: string): Promise<{ reviews: any[] }> {
    return this.get(`/api/mentors/${mentorId}/reviews`);
  }

  async getAnalytics(mentorId: string): Promise<{ analytics: any }> {
    return this.get(`/api/mentors/${mentorId}/analytics`);
  }
}

export const mentorService = new MentorService();
