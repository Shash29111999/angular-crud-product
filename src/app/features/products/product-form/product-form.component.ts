// src/app/features/products/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product, ProductCreateUpdateDto } from '../../../models/product.model';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { of, switchMap, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  isEditMode = false;
  isLoading = true;
  formSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      available: [true],
      color: [''],
      size: [''],
      attributes: [''], // Will store JSON string
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.productId = +idParam;
          this.isEditMode = true;
          this.isLoading = true;
          return this.productsService.getProductById(this.productId).pipe(
            catchError(error => {
              console.error('Error fetching product for edit:', error);
              this.toastService.show('Failed to load product for editing.', 'error');
              this.router.navigate(['/products']);
              return of(null);
            }),
            finalize(() => { // NEW: Use finalize here
              this.isLoading = false;
            })
          );
        } else {
          this.isEditMode = false;
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe(product => {
      // This subscribe is okay here because it's specifically for patching the form,
      // and the outer switchMap ensures the inner observable is handled.
      // The key is that the `product$` observable itself is not being subscribed to multiple times.
      if (product) {
        this.productForm.patchValue(product);
      }
      // isLoading is already handled by finalize in the pipe
    });
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      this.toastService.show('Please correct the form errors.', 'error');
      return;
    }

    this.formSubmitting = true;
    const productData: ProductCreateUpdateDto = this.productForm.value;

    if (this.isEditMode && this.productId !== null) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.toastService.show('Product updated successfully!', 'success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastService.show('Failed to update product.', 'error');
          this.formSubmitting = false;
        },
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => {
          this.toastService.show('Product added successfully!', 'success');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.toastService.show('Failed to add product.', 'error');
          this.formSubmitting = false;
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}