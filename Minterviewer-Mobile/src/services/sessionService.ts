import { BaseService } from './baseService';
import type { TimeSlot, SessionFilters, BookingRequest, CheckoutResponse, Mentor } from '../types/sessionTypes';

export interface BrowseSessionsResponse {
  slots: TimeSlot[];
}

export interface MentorsResponse {
  mentors: Mentor[];
}

export interface ScheduleEvent {
  id: number | string;
  title: string;
  type: "technical" | "behavioral" | "system-design" | "coding" | "mock";
  date: string;
  time: string;
  duration: string;
  interviewer?: string;
  interviewerId?: string;
  description: string;
  status: "upcoming" | "completed" | "cancelled";
  reminder: boolean;
  meetingLink?: string;
}

export interface ScheduleResponse {
  success: boolean;
  events: ScheduleEvent[];
}

export class SessionService extends BaseService {
  /**
   * Browse available sessions with filters
   */
  async browseSessions(filters: SessionFilters): Promise<BrowseSessionsResponse> {
    const params = new URLSearchParams();
    if (filters.topic) params.append('topic', filters.topic);
    if (filters.date) params.append('date', filters.date);
    if (filters.maxPrice < 200) params.append('maxPrice', filters.maxPrice.toString());

    return this.get(`/api/mentees/browse-sessions?${params.toString()}`);
  }

  /**
   * Get all mentors
   */
  async getMentors(): Promise<MentorsResponse> {
    return this.get('/api/mentors');
  }

  /**
   * Book a session via Stripe checkout
   */
  async bookSession(request: BookingRequest): Promise<CheckoutResponse> {
    return this.post('/api/stripe/create-checkout-session', request);
  }

  /**
   * Get mentee's scheduled sessions
   */
  async getMenteeSessions(menteeId: string): Promise<ScheduleResponse> {
    return this.get(`/api/mentee/sessions?menteeId=${menteeId}`);
  }
}
