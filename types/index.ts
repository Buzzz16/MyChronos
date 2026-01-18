// Prisma Types Export
import type { Priority as PriorityType } from "@prisma/client"
export type { User, Agenda, Category, Priority, DisplayMode } from "@prisma/client"

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
}

// Server Time Types
export interface ServerTime {
  datetime: string;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
}

// Countdown Types
export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

// Form Types
export interface CreateAgendaInput {
  title: string;
  description?: string;
  targetDateTime: Date;
  categoryId?: string;
  priority?: PriorityType;
}

export interface UpdateAgendaInput extends Partial<CreateAgendaInput> {
  id: string;
  isCompleted?: boolean;
  isArchived?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

// User Preferences
export interface UserPreferences {
  displayMode: "DETAILED" | "BROAD";
  notificationsEnabled: boolean;
  timezone: string;
}
