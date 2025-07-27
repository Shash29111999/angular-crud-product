// src/app/core/auth/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  
  const requiredRoles = route.data?.['roles'] as string[];
 

  if (!authService.isAuthenticated()) {
   
    toastService.show('You need to be logged in to access this page.', 'error');
    router.navigate(['/auth/login']);
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    
    return true;
  }

  const userRoles = authService.getUserRoles();
  

  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
  

  if (hasRequiredRole) {
    
    return true;
  } else {
    
    toastService.show('You do not have the necessary permissions to access this page.', 'error');
    router.navigate(['/products']); // Redirect to /products if unauthorized
    return false;
  }
};