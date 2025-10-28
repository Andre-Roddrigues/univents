// types/mentorship.ts
export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  experience: number;
  rating: number;
  price: number;
  location: string;
  categories: string[];
  image: string;
  description: string;
  availability: string[];
  availableSlots: AvailableSlot[];
  languages: string[];
  isOnline: boolean;
  isLocal: boolean;
}

export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  id: string;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: 'one-time' | 'package' | 'ongoing';
  categories: string[];
}

export interface BookingFormData {
  mentorId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  sessionType: string;
  paymentMethod: 'card' | 'mpesa' | 'emola' | 'comprovativo';
  cardDetails?: CardDetails;
  phoneNumber?: string;
  studentId?: string;
  proofFile?: File;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}