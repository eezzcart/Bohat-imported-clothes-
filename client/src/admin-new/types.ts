export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[]; // base64 strings
  createdAt: string;
  updatedAt: string;
}

export type ProductFormData = Omit<Product, 'id' | 'images' | 'createdAt' | 'updatedAt'> & {
  images: (string | File)[];
};

export interface ProductFilters {
  search: string;
  category: string;
  sortBy: 'name' | 'price' | 'stock' | 'createdAt';
  sortDir: 'asc' | 'desc';
}
