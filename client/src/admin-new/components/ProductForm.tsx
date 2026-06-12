import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { Product, Category } from '../types';
import ImageUpload from './ImageUpload';
import { trpc } from '@/lib/trpc';
import { Spinner } from '@/components/ui/spinner';

interface ProductFormProps {
  product?: Product;
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number | null;
    stock: number;
    sku?: string;
    status: 'active' | 'draft';
    images: (string | File)[];
  }) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('draft');
  const [images, setImages] = useState<(string | File)[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price);
      setCategoryId(product.categoryId);
      setStock(String(product.stock));
      setSku(product.sku || '');
      setStatus(product.status);
      // Set existing images as URLs
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => img.imageUrl));
      }
    }
  }, [product]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!description.trim()) errs.description = 'Description is required';
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) errs.price = 'Enter a valid price';
    const s = parseInt(stock, 10);
    if (isNaN(s) || s < 0) errs.stock = 'Enter valid stock quantity';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(parseFloat(price).toFixed(2)),
      categoryId,
      stock: parseInt(stock, 10),
      sku: sku.trim() || undefined,
      status,
      images,
    });
  }

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button type="button" onClick={onCancel} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
              errors.price ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Quantity *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
              errors.stock ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          />
          {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value, 10) : null)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* SKU */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU (Optional)</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g., PROD-001"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <ImageUpload images={images} onChange={setImages} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 transition-all"
        >
          <Save className="h-4 w-4" />
          {product ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
