// Global type definitions for BlackWoods Creative

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'film' | 'photography' | '3d' | 'scenes';
  thumbnail: string;
  media: {
    type: 'image' | 'video';
    src: string;
    alt: string;
  }[];
  description: string;
  client?: string;
  year: number;
  tags: string[];
  featured?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: 'film' | 'photography' | '3d' | 'scenes' | 'other';
  budget?: string;
  message: string;
  attachments?: File[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  image?: string;
  rating: number;
  projectType: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice?: string;
}

// Animation and UI Types
export interface AnimationVariant {
  initial: object;
  animate: object;
  exit?: object;
  transition?: object;
}

export interface ScrollProgress {
  scrollY: number;
  scrollYProgress: number;
  scrollDirection: 'up' | 'down';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactFormResponse extends ApiResponse {
  data?: {
    id: string;
    timestamp: string;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
