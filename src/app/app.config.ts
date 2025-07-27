import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ToastService } from './shared/components/toast/toast.service';
import { AuthApiService } from './features/auth/auth-api.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/auth/auth.service';
import { ProductsService } from './features/products/products.service';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
     provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    AuthApiService,
    ToastService,
    AuthService,
    ProductsService
  ],
};
