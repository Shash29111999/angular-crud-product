// src/app/app.routes.ts

import { Routes } from '@angular/router'; // Assuming you have this
import { AuthGuard } from './core/auth/auth.guard';
export const routes: Routes = [
  {
    path: 'auth', // When the URL starts with '/auth'
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    // ^ This is the lazy loading syntax.
    //   - `import('./features/auth/auth.routes')`: Dynamically imports the file.
    //   - `.then(m => m.AUTH_ROUTES)`: Once the file is loaded, it accesses the `AUTH_ROUTES` constant exported from it.
  },
  {
    path: 'products', // Protected routes for products
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    canActivate: [AuthGuard], // Ensure user is logged in
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, // Default redirect for the root path
  { path: '**', redirectTo: '/auth/login' }, // Wildcard route for any unmatched paths
];
