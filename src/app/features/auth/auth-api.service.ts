// src/app/core/services/auth-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../../models/auth.model';
import { environment } from '../../environments/environment';

// Import environment

// Adjust the import path

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private apiUrl = environment.apiUrlRegister; // Base API URL from environment
  private apiUrlLogin = environment.apiUrlLogin; 

  constructor(private http: HttpClient) {}

  register(registerData: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, registerData);
  }

  // NEW: Login method
  login(loginData: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrlLogin}`, loginData);
  }
}
