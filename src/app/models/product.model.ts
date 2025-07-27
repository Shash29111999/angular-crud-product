// src/app/models/product.model.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  available: boolean;
  color: string;
  size: string;
  attributes: string; // Assuming this is a JSON string from the backend
  createdAt?: string; // Optional, if your backend returns it
  updatedAt?: string; // Optional, if your backend returns it
}

// For creating/updating, you might use a slightly different DTO if needed,
// but for simplicity, we'll use the same Product interface for now.
export type ProductCreateUpdateDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;