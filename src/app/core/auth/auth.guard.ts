// src/app/core/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; // Import ActivatedRouteSnapshot, RouterStateSnapshot
import { AuthService } from './auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const isAuthenticated = authService.isAuthenticated();
  const isAuthRoute = state.url.startsWith('/auth/'); // Check if the current URL is an auth route

  if (isAuthenticated) {
    // If user IS authenticated
    if (isAuthRoute) {
      // And they are trying to go to an auth route (login/register)
      toastService.show('You are already logged in.', 'success');
      router.navigate(['/products']); // Redirect to a protected route (e.g., product list)
      return false; // Prevent access to login/register
    }
    // If authenticated and not an auth route, allow access
    return true;
  } else {
    // If user is NOT authenticated
    if (isAuthRoute) {
      // And they are trying to go to an auth route (login/register), allow it
      return true;
    } else {
      // If not authenticated and trying to go to a protected route, redirect to login
      toastService.show('You need to be logged in to access this page.', 'error');
      router.navigate(['/auth/login']);
      return false;
    }
  }
};