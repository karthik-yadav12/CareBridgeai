// API Configuration for local development and live cloud production deployment
export const API_BASE_URL = typeof window !== 'undefined' && window.location.origin.includes(':5173')
  ? 'http://localhost:5000'
  : '';
