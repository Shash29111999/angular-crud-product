// src/app/models/auth.model.ts

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  message?: string; // For success/error messages from API
  token?: string; // For login success
  errors?: string[];// For validation errors from API
   role?: string;  
  // Add any other properties your API returns
}
