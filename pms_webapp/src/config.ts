// src/config.ts

// API base URL - should match your backend server
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 15000;

// Password strength settings
export const PASSWORD_STRENGTH = {
  WEAK: 'Weak',
  MEDIUM: 'Medium',
  STRONG: 'Strong',
  VERY_STRONG: 'Very Strong'
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRES_UPPERCASE: true,
  REQUIRES_LOWERCASE: true,
  REQUIRES_NUMBER: true,
  REQUIRES_SPECIAL: true
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_EMAIL: 'user_email',
  THEME: 'theme_preference'
};