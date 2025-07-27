// src/app/features/products/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../products.service';
import { Product } from '../../../models/product.model';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Observable, catchError, of, tap, finalize, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs'; // NEW: Import Subject, debounceTime, distinctUntilChanged, switchMap
import { FormsModule } from '@angular/forms'; // NEW: Import FormsModule for ngModel

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products$?: Observable<Product[]>;
  isLoading = true;
  isAdmin = false;
  searchTerm: string = ''; // NEW: Property for search input
  private searchTerms = new Subject<string>(); // NEW: Subject for search input changes

  constructor(
    private productsService: ProductsService,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadProducts(); // Initial load

    // NEW: Setup debounce for search input
    this.searchTerms.pipe(
      debounceTime(300), // Wait for 300ms after the last keystroke
      distinctUntilChanged(), // Only emit if value is different from previous value
      tap(() => this.isLoading = true), // Show loading indicator during search
      switchMap((term: string) => {
        if (term.trim() === '') {
          return this.productsService.getProducts(); // If search term is empty, get all products
        } else {
          return this.productsService.searchProducts(term); // Otherwise, call search API
        }
      }),
      catchError((error) => {
        console.error('Error during search:', error);
        this.toastService.show('Failed to perform search. Please try again.', 'error');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(products => {
      this.products$ = of(products); // Update the observable with search results
    });
  }

  private checkUserRole(): void {
    const userRoles = this.authService.getUserRoles();
    this.isAdmin = userRoles.includes('Admin');
  }

  loadProducts(): void {
    this.isLoading = true;
    this.products$ = this.productsService.getProducts().pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        this.toastService.show('Failed to load products. Please try again.', 'error');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  // NEW: Method to push search term changes to the Subject
  onSearchTermChange(term: string): void {
    this.searchTerms.next(term);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products/detail', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.toastService.show('Product deleted successfully!', 'success');
          this.loadProducts(); // Reload the list after deletion (or re-trigger search)
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.toastService.show('Failed to delete product.', 'error');
        },
      });
    }
  }

  addNewProduct(): void {
    this.router.navigate(['/products/add']);
  }

  // NEW: Logout functionality
  logout(): void {
    this.authService.logout(); // This will clear token and redirect to login
    this.toastService.show('You have been logged out.', 'success');
  }
}