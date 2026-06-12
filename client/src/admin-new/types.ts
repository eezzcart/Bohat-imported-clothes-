/**
 * Admin panel types matching the backend schema
 */

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string; // Decimal from backend
  categoryId: number | null;
  stock: number;
  sku: string | null;
  status: "active" | "draft";
  primaryImageId: number | null;
  createdAt: Date;
  updatedAt: Date;
  // Populated by queries
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  imageKey: string;
  altText: string | null;
  displayOrder: number;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  stock: number;
  sku?: string;
  status: "active" | "draft";
  images: (string | File)[]; // URLs or File objects
};

export interface ProductFilters {
  search: string;
  category: string;
  sortBy: "name" | "price" | "stock" | "createdAt";
  sortDir: "asc" | "desc";
}
