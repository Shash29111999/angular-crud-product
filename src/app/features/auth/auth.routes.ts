// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Assuming you have this
import { RegisterComponent } from './register/register.component'; // Import the new RegisterComponent
import { AuthGuard } from '../../core/auth/auth.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent,
    canActivate: [AuthGuard] // Apply AuthGuard here
   },
  { path: 'register', component: RegisterComponent,
     canActivate: [AuthGuard]
   },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default for /auth
];
