// src/app/features/products/products.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductCreateUpdateDto } from '../../models/product.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root', // Makes this service a singleton
})
export class ProductsService {
  private apiUrl = `${environment.apiUrlGetProduct}`; // Base URL for product API

  constructor(private http: HttpClient) {}

  /**
   * Fetches all products from the API.
   * @returns An Observable of an array of Product objects.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Fetches a single product by its ID.
   * @param id The ID of the product to fetch.
   * @returns An Observable of a single Product object.
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new product.
   * @param productData The data for the new product.
   * @returns An Observable of the created Product object.
   */
  createProduct(productData: ProductCreateUpdateDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  /**
   * Updates an existing product.
   * @param id The ID of the product to update.
   * @param productData The updated data for the product.
   * @returns An Observable of the updated Product object (or void for 204 No Content).
   */
  updateProduct(id: number, productData: ProductCreateUpdateDto): Observable<void> {
    // Note: Backend typically returns 204 No Content for successful PUT, so Observable<void> is common.
    return this.http.put<void>(`${this.apiUrl}/${id}`, productData);
  }

  /**
   * Deletes a product by its ID.
   * @param id The ID of the product to delete.
   * @returns An Observable of void (for 204 No Content).
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  searchProducts(term: string): Observable<Product[]> {
    let params = new HttpParams().set('term', term);
    // The API URL is `http://localhost:5134/api/Product/search?term=apple`
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }
}