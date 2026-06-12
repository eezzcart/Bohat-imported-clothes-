import type { Product } from '../types';

const PRODUCTS_KEY = 'shop_products';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const now = new Date().toISOString();
  const product: Product = { ...data, id: generateId(), createdAt: now, updatedAt: now };
  const products = getProducts();
  products.unshift(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product | null {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated: Product = {
    ...data,
    id,
    createdAt: products[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function seedDemoProducts(): void {
  const existing = getProducts();
  if (existing.length > 0) return;

  const demoProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Classic Leather Watch',
      description: 'Premium leather strap watch with minimalist design. Swiss movement, sapphire crystal glass, and water-resistant up to 50 meters.',
      price: 249.99,
      category: 'Accessories',
      stock: 45,
      images: [],
    },
    {
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality for audiophiles.',
      price: 179.00,
      category: 'Electronics',
      stock: 120,
      images: [],
    },
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Soft, breathable 100% organic cotton crew neck t-shirt. Ethical manufacturing with a relaxed fit.',
      price: 34.99,
      category: 'Clothing',
      stock: 200,
      images: [],
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Double-wall vacuum insulated bottle. Keeps drinks cold 24h or hot 12h. BPA-free, 750ml capacity.',
      price: 28.50,
      category: 'Home & Living',
      stock: 350,
      images: [],
    },
    {
      name: 'Mechanical Keyboard RGB',
      description: 'Full-size mechanical keyboard with Cherry MX switches, per-key RGB lighting, and aircraft-grade aluminum frame.',
      price: 159.99,
      category: 'Electronics',
      stock: 78,
      images: [],
    },
    {
      name: 'Leather Messenger Bag',
      description: 'Handcrafted full-grain leather messenger bag. Fits 15" laptop, multiple compartments, brass hardware.',
      price: 189.00,
      category: 'Accessories',
      stock: 32,
      images: [],
    },
    {
      name: 'Smart Home Speaker',
      description: 'Voice-controlled smart speaker with room-filling sound, built-in smart home hub, and privacy controls.',
      price: 99.99,
      category: 'Electronics',
      stock: 150,
      images: [],
    },
    {
      name: 'Running Shoes Ultralight',
      description: 'Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable outsole.',
      price: 129.95,
      category: 'Clothing',
      stock: 65,
      images: [],
    },
  ];

  for (const p of demoProducts) {
    addProduct(p);
  }
}
