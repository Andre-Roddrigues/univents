// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  bio: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsReminders: boolean;
  };
  createdAt: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
  paymentMethod: string;
  meetingLink?: string;
  notes?: string;
  rating?: number;
  review?: string;
}

export interface BookingStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}