import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProduct, deleteProduct } from '../lib/storage';
import type { Product } from '../types';
import DeleteModal from '../components/DeleteModal';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const found = getProduct(id);
    if (found) {
      setProduct(found);
      if (found.images.length > 0) setSelectedImage(found.images[0]);
    } else {
      setNotFound(true);
    }
  }, [id]);

  function handleDelete() {
    if (!id) return;
    deleteProduct(id);
    navigate('/admin/products');
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-slate-900">Product Not Found</h2>
        <button onClick={() => navigate('/admin/products')} className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">Back to Products</button>
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
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image gallery */}
        <div className="lg:col-span-1 space-y-3">
          <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === img ? 'border-violet-500' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  {product.category}
                </span>
              </div>
              <span className="text-3xl font-bold text-violet-600">${product.price.toFixed(2)}</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">{product.description}</p>

            {/* Meta */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <Package className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Stock</p>
                  <p className={`text-sm font-semibold ${product.stock <= 10 ? 'text-red-600' : 'text-slate-900'}`}>
                    {product.stock} units
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <DollarSign className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Inventory Value</p>
                  <p className="text-sm font-semibold text-slate-900">
                    ${(product.price * product.stock).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 border-t border-slate-200 pt-5">
              <button
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Product
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteModal product={product} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}
    </div>
  );
}
