// products.routes.ts (example)
import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { RoleGuard } from '../../core/auth/role.guard';
 // Import RoleGuard

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '', // /products
    component: ProductListComponent,
    canActivate: [RoleGuard], // Both Admin and Viewer can list
    data: { roles: ['Admin', 'Viewer'] }
  },
  {
    path: 'detail/:id', // /products/detail/123
    component: ProductDetailComponent,
    canActivate: [RoleGuard], // Both Admin and Viewer can view detail
    data: { roles: ['Admin', 'Viewer'] }
  },
  {
    path: 'add', // /products/add
    component: ProductFormComponent,
    canActivate: [RoleGuard], // Only Admin can add
    data: { roles: ['Admin'] }
  },
  {
    path: 'edit/:id', // /products/edit/123
    component: ProductFormComponent,
    canActivate: [RoleGuard], // Only Admin can edit
    data: { roles: ['Admin'] }
  }
];
