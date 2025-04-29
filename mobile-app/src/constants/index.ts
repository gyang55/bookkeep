// Predefined expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities',
  'Housing',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
];

// Colors for charts and UI
export const COLORS = {
  PRIMARY: '#27ae60',
  SECONDARY: '#2980b9',
  ACCENT: '#f39c12',
  DANGER: '#e74c3c',
  TEXT_DARK: '#2c3e50',
  TEXT_LIGHT: '#7f8c8d',
  BACKGROUND: '#f5f5f5',
  CARD: '#ffffff',
  BORDER: '#dddddd',
};

// Category colors for charts
export const CATEGORY_COLORS = [
  '#27ae60', // Primary green
  '#2980b9', // Blue
  '#8e44ad', // Purple
  '#f39c12', // Orange
  '#d35400', // Dark orange
  '#c0392b', // Red
  '#16a085', // Teal
  '#2c3e50', // Dark blue
  '#f1c40f', // Yellow
  '#e74c3c', // Light red
];

// Async storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'family_bookkeeping_auth_token',
  USER_DATA: 'family_bookkeeping_user',
};

// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/dev',
  TIMEOUT: 10000,
};