export interface Mentor {
  _id: string;
  userId?: string; // Added for chat
  name: string;
  photo?: string;
  bio?: string;
  yearsOfExperience?: number;
  rating?: number;
  reviewsCount?: number;
  focusAreas?: string[];
  hourlyRate?: number;
  stripeAccountId?: string;
  company?: string;
  location?: string;
  languages?: string[];
  achievements?: string[];
  sessionOfferings?: SessionOffering[];
}

export interface SessionOffering {
  _id: string;
  title: string;
  topic: string;
  sessionType: string;
  duration: number;
  price: number;
  description: string;
  active: boolean;
}

export interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
  mentor: {
    _id: string;
    userId?: string;
    name: string;
    photo: string;
    bio: string;
    focusAreas: string[];
    experience: number;
    rating: number;
    reviews: number;
  };
  session: {
    title: string;
    topic: string;
    type: string;
    price: number;
    description: string;
  };
}

export interface SessionFilters {
  topic: string;
  date: string;
  maxPrice: number;
}

export interface BookingRequest {
  sessionId: string;
  mentorId: string;
  menteeId: string;
  price: number;
  title: string;
  mentorName: string;
  mentorPhoto: string;
}

export interface CheckoutResponse {
  sessionId?: string;
  url?: string;
  error?: string;
}
