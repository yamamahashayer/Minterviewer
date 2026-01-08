import { BaseService } from './baseService';

// Data models matching Web API responses
export interface MentorOverviewResponse {
  success: boolean;
  data: {
    upcomingSessions: Array<{
      id: string;
      mentee: string;
      menteePhoto: string;
      type: string;
      date: string;
      time: string;
      color: string;
      borderColor: string;
    }>;
    stats: {
      satisfaction: string;
      sessionsThisWeek: number;
      rank: string;
      level: number;
      xp: number;
      maxXp: number;
      progress: number;
    };
    progressChart: Array<{
      week: string;
      progress: number;
    }>;
  };
}

export interface MentorSessionsResponse {
  success: boolean;
  data: {
    pending: Array<{
      id: string;
      mentee: string;
      menteeId: string;
      avatar: string;
      type: string;
      date: string;
      time: string;
      scheduledTime: string;
      status: string;
      message: string;
      price: number;
      submittedTime: string;
      jitsiLink: string;
      feedback: boolean;
      color: string;
    }>;
    upcoming: Array<{
      id: string;
      mentee: string;
      menteeId: string;
      avatar: string;
      type: string;
      date: string;
      time: string;
      scheduledTime: string;
      status: string;
      message: string;
      price: number;
      submittedTime: string;
      jitsiLink: string;
      feedback: boolean;
      color: string;
    }>;
    past: Array<{
      id: string;
      mentee: string;
      menteeId: string;
      avatar: string;
      type: string;
      date: string;
      time: string;
      scheduledTime: string;
      status: string;
      message: string;
      price: number;
      submittedTime: string;
      jitsiLink: string;
      feedback: boolean;
      color: string;
    }>;
  };
}

export interface MentorAnalyticsResponse {
  success: boolean;
  data: {
    kpis: {
      totalEarnings: number;
      totalSessions: number;
      completedSessions: number;
      averageRating: number;
      activeMentees: number;
      pendingEarnings: number;
      completionRate: number;
    };
    earnings: {
      trend: Array<{
        month: string;
        earnings: number;
        sessions: number;
      }>;
      breakdown: Array<{
        type: string;
        revenue: number;
        sessions: number;
        percentage: string;
      }>;
      total: number;
      pending: number;
      growth: number;
    };
    sessions: {
      total: number;
      completed: number;
      completionRate: number;
      byStatus: Record<string, number>;
      byType: Array<{
        type: string;
        count: number;
      }>;
    };
    feedback: {
      total: number;
      averageRating: number;
      distribution: Array<{
        rating: number;
        count: number;
      }>;
      recent: Array<{
        id: string;
        mentee: {
          name: string;
          photo: string;
        };
        rating: number;
        reviewText: string;
        date: string;
      }>;
    };
    mentees: {
      total: number;
      list: Array<{
        id: string;
        name: string;
        email: string;
        photo: string;
        totalSessions: number;
        completedSessions: number;
        lastSessionDate: string;
        averageRating: string | null;
      }>;
    };
    performance: {
      earningsGrowth: number;
      topSessionType: string;
    };
  };
}

export interface MentorFeedbacksResponse {
  success: boolean;
  data: {
    pending: Array<{
      id: string;
      menteeId: string;
      menteeName: string;
      sessionTitle: string;
      date: string;
      rawDate: string;
    }>;
    submitted: Array<{
      id: string;
      menteeName: string;
      sessionTitle: string;
      date: string;
      rating: number;
      feedback: string;
      strengths: string[];
      improvements: string[];
    }>;
    received: Array<{
      id: string;
      studentName: string;
      sessionTitle: string;
      date: string;
      rating: number;
      feedback: string;
      tags: string[];
    }>;
  };
}

export interface MentorEarningsResponse {
  success: boolean;
  data: {
    totalEarnings: number;
    totalSessions: number;
    avgPerSession: number;
    pendingEarnings: number;
    chartData: Array<{
      month: string;
      earnings: number;
    }>;
    transactions: Array<{
      id: string;
      menteeName: string;
      menteeAvatar: string;
      sessionType: string;
      amount: number;
      date: string;
      status: 'completed' | 'pending';
    }>;
    sessionsBreakdown: Array<{
      type: string;
      sessions: number;
      earnings: number;
      price: number;
    }>;
  };
}

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
  // Overview API - matches /api/mentor/overview
  async getOverview(): Promise<MentorOverviewResponse> {
    return this.get('/api/mentor/overview');
  }

  // Sessions API - matches /api/mentor/sessions
  async getSessions(): Promise<MentorSessionsResponse> {
    return this.get('/api/mentor/sessions');
  }

  // Analytics API - matches /api/mentor/analytics
  async getAnalytics(months?: number): Promise<MentorAnalyticsResponse> {
    const query = months ? `?months=${months}` : '';
    return this.get(`/api/mentor/analytics${query}`);
  }

  // Feedbacks API - matches /api/mentor/feedbacks
  async getFeedbacks(): Promise<MentorFeedbacksResponse> {
    return this.get('/api/mentor/feedbacks');
  }

  async submitFeedback(data: {
    sessionId: string;
    menteeId: string;
    rating: number;
    feedback: string;
    strengths?: string[];
    improvements?: string[];
  }): Promise<{ success: boolean; data: any }> {
    return this.post('/api/mentor/feedbacks', data);
  }

  // Earnings API - matches /api/mentor/earnings
  async getEarnings(): Promise<MentorEarningsResponse> {
    return this.get('/api/mentor/earnings');
  }

  // Profile APIs - matches /api/mentors/[mentorid]/profile
  async getProfile(mentorId: string): Promise<{ ok: boolean; profile: any; stats: any; reviews: any[] }> {
    return this.get(`/api/mentors/${mentorId}/profile`);
  }

  async updateProfile(mentorId: string, data: any): Promise<{ ok: boolean; profile: any; stats: any; reviews: any[] }> {
    return this.put(`/api/mentors/${mentorId}/profile`, { profile: data });
  }

  // Legacy methods for compatibility (to be removed after migration)
  async getSessionsByMentor(mentorId: string): Promise<{ sessions: Session[] }> {
    return this.get(`/api/mentors/${mentorId}/sessions`);
  }

  async getStudents(mentorId: string): Promise<{ students: any[] }> {
    return this.get(`/api/mentors/${mentorId}/students`);
  }

  async getReviews(mentorId: string): Promise<{ reviews: any[] }> {
    return this.get(`/api/mentors/${mentorId}/reviews`);
  }

  async getAnalyticsByMentor(mentorId: string): Promise<{ analytics: any }> {
    return this.get(`/api/mentors/${mentorId}/analytics`);
  }
}

export const mentorService = new MentorService();
