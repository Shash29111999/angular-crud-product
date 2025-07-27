// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side errors
        switch (error.status) {
          case 400: // Bad Request (e.g., validation errors from API)
            if (error.error && typeof error.error === 'object') {
              // Assuming API returns { errors: ["error1", "error2"] } or { message: "..." }
              if (error.error.errors && Array.isArray(error.error.errors)) {
                errorMessage = error.error.errors.join(', ');
              } else if (error.error.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = 'Bad Request: Invalid data provided.';
              }
            } else if (error.error) { // Raw string error
                errorMessage = error.error;
            } else {
                errorMessage = 'Bad Request: Please check your input.';
            }
            break;
          case 401: // Unauthorized
            errorMessage = 'Unauthorized: Please log in.';
            // Clear token and redirect to login
            localStorage.removeItem('jwt_token');
            router.navigate(['/auth/login']);
            break;
          case 403: // Forbidden
            errorMessage = 'Forbidden: You do not have permission to access this resource.';
            router.navigate(['/products']); // Or a dedicated unauthorized page
            break;
          case 404: // Not Found
            errorMessage = 'Resource not found.';
            break;
          case 500: // Internal Server Error
            if (error.error && error.error.message) {
                errorMessage = `Server Error: ${error.error.message}`;
            } else {
                errorMessage = 'Internal Server Error: Something went wrong on the server.';
            }
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown Error'}`;
            break;
        }
      }

      toastService.show(errorMessage, 'error');
      return throwError(() => new Error(errorMessage)); // Re-throw the error for component-specific handling if needed
    })
  );
};