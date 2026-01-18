// API Route Types
export const API_ROUTES = {
  AGENDAS: '/api/agendas',
  CATEGORIES: '/api/categories',
  USER: '/api/user',
  LOCATION: '/api/location',
  TIME: '/api/time',
} as const;

// Validation Constants
export const VALIDATION = {
  MAX_AGENDAS_PER_USER: 100,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_TITLE_LENGTH: 3,
  MAX_CATEGORY_NAME_LENGTH: 50,
} as const;

// Time Constants
export const TIME = {
  MAX_TIME_DEVIATION_MS: 5 * 60 * 1000, // 5 minutes
  SYNC_INTERVAL_MS: 60 * 1000, // 1 minute
  COUNTDOWN_UPDATE_INTERVAL_MS: 1000, // 1 second
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  LOW: '#10B981',      // Green
  MEDIUM: '#F59E0B',   // Amber
  HIGH: '#EF4444',     // Red
  URGENT: '#DC2626',   // Dark Red
} as const;

// Priority Labels
export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
} as const;

// Display Mode Settings
export const DISPLAY_MODES = {
  DETAILED: {
    label: 'Detailed',
    description: 'Shows hours, minutes, and seconds',
  },
  BROAD: {
    label: 'Broad',
    description: 'Shows only days and hours',
  },
} as const;

// External API URLs
export const EXTERNAL_APIS = {
  WORLDTIME: process.env.NEXT_PUBLIC_WORLDTIME_API || 'https://worldtimeapi.org/api',
  NOMINATIM: process.env.NEXT_PUBLIC_NOMINATIM_API || 'https://nominatim.openstreetmap.org',
} as const;

// Notification Messages
export const NOTIFICATIONS = {
  AGENDA_STARTING: (title: string) => `⏰ "${title}" is starting now!`,
  AGENDA_CREATED: 'Agenda created successfully',
  AGENDA_UPDATED: 'Agenda updated successfully',
  AGENDA_DELETED: 'Agenda deleted successfully',
  AGENDA_COMPLETED: 'Agenda marked as completed',
  CATEGORY_CREATED: 'Category created successfully',
  LOCATION_UPDATED: 'Location updated successfully',
  TIME_SYNCED: 'Time synchronized with server',
} as const;

// Error Messages
export const ERRORS = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  MAX_AGENDAS_REACHED: `Maximum of ${VALIDATION.MAX_AGENDAS_PER_USER} agendas reached.`,
  INVALID_DATE: 'Please select a valid future date and time.',
  LOCATION_DENIED: 'Location access denied. Please enable location services.',
  NOTIFICATION_DENIED: 'Notification permission denied.',
} as const;
