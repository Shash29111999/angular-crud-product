// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthApiService } from '../auth-api.service';
import { AuthService } from '../../../core/auth/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false; // NEW: Loading state

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.toastService.show('Please enter your username and password.', 'error');
      return;
    }

    this.isLoading = true; // NEW: Set loading to true
    const { username, password } = this.loginForm.value;

    try {
      const response = await this.authApiService.login({ username, password }).toPromise();

      if (response?.token) {
        this.authService.setToken(response.token);
        this.toastService.show('Login successful!', 'success');
        this.router.navigate(['/products']); // Attempt navigation
      } else if (response?.message) {
        this.toastService.show(response.message, 'error');
      } else {
        this.toastService.show('Login failed. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Login API error:', error);
      if (error.status === 401) {
        this.toastService.show('Invalid username or password.', 'error');
      } else if (error.error?.message) {
        this.toastService.show(error.error.message, 'error');
      } else {
        this.toastService.show('An unexpected error occurred during login.', 'error');
      }
    } finally {
      this.isLoading = false; // NEW: Always set loading to false
    }
  }
}