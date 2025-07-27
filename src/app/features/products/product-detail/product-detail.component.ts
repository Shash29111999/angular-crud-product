// src/app/features/products/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../../../models/product.model';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { Observable, of, switchMap, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product$?: Observable<Product | null>;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.toastService.show('Invalid product ID.', 'error');
          this.router.navigate(['/products']);
          return of(null);
        }
        this.isLoading = true;
        return this.productsService.getProductById(id).pipe(
          catchError(error => {
            console.error('Error fetching product details:', error);
            this.toastService.show('Failed to load product details.', 'error');
            this.router.navigate(['/products']);
            return of(null);
          }),
          finalize(() => { // NEW: Use finalize here as well
            this.isLoading = false;
          })
        );
      })
    );

    // REMOVED: this.product$.subscribe(() => { this.isLoading = false; });
    // The async pipe in the template will handle the subscription.
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}