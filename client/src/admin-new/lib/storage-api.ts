/**
 * API-based storage layer for admin panel
 * This replaces the localStorage implementation with tRPC calls
 */

import { trpc } from "@/lib/trpc";

/**
 * Note: This file exports async functions that call the tRPC API.
 * Components should use React Query hooks from tRPC directly instead of calling these functions.
 * These are utility functions for one-off operations.
 */

export async function getProductsAPI() {
  try {
    return await trpc.products.list.query();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductAPI(id: number) {
  try {
    return await trpc.products.getById.query({ id });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function getCategoriesAPI() {
  try {
    return await trpc.categories.list.query();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
