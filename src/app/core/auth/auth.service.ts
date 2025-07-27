// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this package

// Install jwt-decode: npm install jwt-decode

interface DecodedToken {
  role: string | string[]; // Can be a single string or an array of strings
  exp: number; // Expiration timestamp
  // Add other claims you expect from your JWT (e.g., sub, email, name)
  [key: string]: any; // Allow for other properties
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token'; // Key for localStorage

  constructor(private router: Router) {}

  /**
   * Stores the JWT token and role after successful login.
   * @param token The JWT token received from the backend.
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieves the JWT token from local storage.
   * @returns The JWT token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Decodes the JWT token to extract its payload.
   * @returns The decoded token payload or null if the token is invalid/missing.
   */
  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout(); // Logout if token is malformed
        return null;
      }
    }
    return null;
  }

  /**
   * Checks if the user is authenticated (has a valid, non-expired token).
   * @returns True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      return false;
    }
    // Check if token is expired
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp > currentTime;
  }

  /**
   * Gets the roles of the currently authenticated user.
   * @returns An array of role strings, or an empty array if not authenticated or no roles.
   */
  getUserRoles(): string[] {
    const decodedToken = this.decodeToken();
   
    if (decodedToken && decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
      // The 'role' claim can be a string for a single role or an array for multiple roles
      if (Array.isArray(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])) {
        return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      } else if (typeof decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'string') {
        return [decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]];
      }
    }
    return [];
  }

  /**
   * Logs out the user by removing the token and redirecting to login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }
}