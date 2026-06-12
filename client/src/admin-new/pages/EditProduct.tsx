import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import { getProduct, updateProduct } from '../lib/storage';
import type { Product } from '../types';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const found = getProduct(id);
    if (found) setProduct(found);
    else setNotFound(true);
  }, [id]);

  function handleSave(data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
  }) {
    if (!id) return;
    updateProduct(id, data);
    navigate('/admin/products');
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-slate-900">Product Not Found</h2>
        <p className="mt-1 text-sm text-slate-500">The product you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm
          product={product}
          onSave={handleSave}
          onCancel={() => navigate('/admin/products')}
        />
      </div>
    </div>
  );
}
