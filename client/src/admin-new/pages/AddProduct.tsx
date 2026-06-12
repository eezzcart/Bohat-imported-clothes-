import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { addProduct } from '../lib/storage';

export default function AddProduct() {
  const navigate = useNavigate();

  function handleSave(data: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
  }) {
    addProduct(data);
    navigate('/admin/products');
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
        <ProductForm onSave={handleSave} onCancel={() => navigate('/admin/products')} />
      </div>
    </div>
  );
}
