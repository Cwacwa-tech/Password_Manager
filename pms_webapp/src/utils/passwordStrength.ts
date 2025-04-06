// src/utils/passwordStrength.ts
import { PASSWORD_STRENGTH, PASSWORD_REQUIREMENTS } from '../config';

export interface PasswordScore {
  score: number; // 0-4
  label: string;
  suggestions: string[];
}

export const checkPasswordStrength = (password: string): PasswordScore => {
  let score = 0;
  const suggestions: string[] = [];

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    suggestions.push(`Password should be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (PASSWORD_REQUIREMENTS.REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check for lowercase letters
  if (PASSWORD_REQUIREMENTS.REQUIRES_LOWERCASE && !/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters');
  } else if (/[a-z]/.test(password)) {
    score += 0.5;
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.REQUIRES_NUMBER && !/[0-9]/.test(password)) {
    suggestions.push('Add numbers');
  } else if (/[0-9]/.test(password)) {
    score += 1;
  }

  // Check for special characters
  if (PASSWORD_REQUIREMENTS.REQUIRES_SPECIAL && !/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Add special characters (e.g., !@#$%^&*)');
  } else if (/[^A-Za-z0-9]/.test(password)) {
    score += 1.5;
  }

  // Additional length bonus
  if (password.length >= 12) {
    score += 0.5;
  }
  
  if (password.length >= 16) {
    score += 0.5;
  }

  // Convert score to 0-4 range
  const normalizedScore = Math.min(Math.floor(score), 4);
  
  // Get appropriate label
  let label = PASSWORD_STRENGTH.WEAK;
  if (normalizedScore === 1) {
    label = PASSWORD_STRENGTH.WEAK;
  } else if (normalizedScore === 2) {
    label = PASSWORD_STRENGTH.MEDIUM;
  } else if (normalizedScore === 3) {
    label = PASSWORD_STRENGTH.STRONG;
  } else if (normalizedScore === 4) {
    label = PASSWORD_STRENGTH.VERY_STRONG;
  }

  return {
    score: normalizedScore,
    label,
    suggestions
  };
};

// Function to generate a secure password
export const generateSecurePassword = (length = 16): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure at least one of each character type
  let password = getRandomChar(uppercaseChars) + 
                 getRandomChar(lowercaseChars) + 
                 getRandomChar(numberChars) + 
                 getRandomChar(specialChars);
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return shuffleString(password);
};

// Helper function to get a random character from a string
const getRandomChar = (str: string): string => {
  return str.charAt(Math.floor(Math.random() * str.length));
};

// Helper function to shuffle a string
const shuffleString = (str: string): string => {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
};