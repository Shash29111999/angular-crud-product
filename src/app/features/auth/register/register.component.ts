// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthApiService } from '../auth-api.service';
import { ToastService } from '../../../shared/components/toast/toast.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService ,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator } // Apply cross-field validation
    );
  }

  // Custom password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value) {
      return null; // Don't validate if empty, Validators.required handles this
    }

    const hasCapital = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    // Interpreting "one alphanumeric character" as one special character for stronger password
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);
    const isLongEnough = value.length >= 7; // Greater than 6 means at least 7

    const passwordValid = hasCapital && hasNumber && hasSpecial && isLongEnough;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasCapital: hasCapital,
          hasNumber: hasNumber,
          hasSpecial: hasSpecial,
          isLongEnough: isLongEnough,
        },
      };
    }
    return null;
  }

  // Custom password match validator for the FormGroup
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password?.value &&
      confirmPassword?.value &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null); // Clear error if they match
      return null;
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    this.registerForm.markAllAsTouched(); // Mark all fields as touched to show errors
    if (this.registerForm.invalid) {
      this.toastService.show('Please fix the form errors.', 'error');
      return;
    }

    const { email, username, password } = this.registerForm.value;

    try {
      const response = await this.authApiService
        .register({ email, username, password })
        .toPromise();

      if (response?.message) {
        this.toastService.show(response.message, 'success');
        this.router.navigate(['/auth/login']); // Navigate to login after successful registration
      } else {
        // Handle API errors (e.g., if API returns specific error messages)
        const errorMessage =
          response?.errors?.join(', ') ||
          'Registration failed. Please try again.';
        this.toastService.show(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('Registration API error:', error);
      const errorMessage =
        error.error?.message ||
        error.message ||
        'An unexpected error occurred.';
      this.toastService.show(errorMessage, 'error');
    }
  }
}
