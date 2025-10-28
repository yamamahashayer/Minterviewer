
export interface Mentor {
  specialties: any;
  title: any;
  company: any;
  id: number;
  name: string;
  field: string;
  companyName: string;
  email: string;
  userName: string;
  imageLink: string;
  createdAt: string;
  reviewCount: number;
  reviewAverage: number;
  experience: number;
  skills: string[];
  description?: string;
  availabilities?: Availability[];
  price: number;
  cvLink: string;
}


export interface ApiMentor {
  id: number;
  name: string;
  email: string;
  companyName: string;
  description: string;
  price: number;
  experiences: number;
  field: string;
  reviewCount: number;
  reviewAverage: number;
  createdAt: string;
  imageLink: string;
  cvLink: string;
  skills: string[];
  availabilities: Availability[];
}

export interface Availability {
  mentorAvailabilityId: number;
  dayOfWeek: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationInMinutes: number;
  isBooked: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FilterState {
  searchTerm: string;
  selectedSpecialty: string;
  selectedExperience: string;
  selectedRating: string;
}

export interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}



export interface SessionType {
  value: string;
  label: string;
  price: number;
}

export interface BookingData {
  mentorId: number;
  date: string;
  time: string;
  sessionType: string;
  duration: string;
  total: number;
  notes: string;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  isDark: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  email: string;
}

// Mentor Registration Types
export interface MentorRegistrationPayload {
  name: string;
  field: string;
  companyName: string;
  description: string;
  experiences: number;
  price: number;
  stripeAccountId: string;
  email: string;
  password: string;
  skillIds: number[];
  availabilities: AvailabilityRegistration[];
}

export interface AvailabilityRegistration {
  startTime: string; // ISO string
  endTime: string; // ISO string
}


