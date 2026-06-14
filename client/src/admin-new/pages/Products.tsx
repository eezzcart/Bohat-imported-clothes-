import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Filter,
  Package,
  X,
  Eye,
} from 'lucide-react';
import type { Product, ProductFilters } from '../types';
import DeleteModal from '../components/DeleteModal';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Products() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Fetch products from backend
  const { data: products = [], isLoading, refetch } = trpc.products.list.useQuery();
  
  // Get query client for cache invalidation
  const utils = trpc.useContext();
  
  // Delete mutation - invalidates both admin and public product caches
  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success('Product deleted successfully');
      refetch();
      // Invalidate public products cache so storefront updates
      utils.publicProducts.list.invalidate();
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category?.name).filter(Boolean))].sort() as string[],
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false) ||
          (p.category?.name.toLowerCase().includes(q) ?? false)
      );
    }

    if (filters.category) {
      list = list.filter((p) => p.category?.name === filters.category);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (filters.sortBy === 'price') cmp = parseFloat(a.price) - parseFloat(b.price);
      else if (filters.sortBy === 'stock') cmp = a.stock - b.stock;
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [products, filters]);

  const toggleSort = useCallback(
    (col: ProductFilters['sortBy']) => {
      setFilters((prev) => ({
        ...prev,
        sortBy: col,
        sortDir: prev.sortBy === col && prev.sortDir === 'asc' ? 'desc' : 'asc',
      }));
    },
    []
  );

  function handleDelete() {
    if (!deleteTarget) return;
    deleteProductMutation.mutate({ id: deleteTarget.id });
  }

  function SortIcon({ col }: { col: ProductFilters['sortBy'] }) {
    if (filters.sortBy !== col)
      return <ChevronDown className="h-3.5 w-3.5 text-slate-300" />;
    return filters.sortDir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-violet-600" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-violet-600" />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            {categories.length > 0 && (
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-2 hover:text-violet-600"
                  >
                    Product <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-2 hover:text-violet-600"
                  >
                    Price <SortIcon col="price" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  <button
                    onClick={() => toggleSort('stock')}
                    className="flex items-center gap-2 hover:text-violet-600"
                  >
                    Stock <SortIcon col="stock" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-slate-300" />
                      <p className="text-slate-500">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.primaryImageId && (
                          <img
                            src={`https://via.placeholder.com/40?text=${product.name}`}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          product.stock > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            setViewImage(
                              `https://via.placeholder.com/500?text=${product.name}`
                            )
                          }
                          className="rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded p-1 text-slate-600 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-lg">
            <button
              onClick={() => setViewImage(null)}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={viewImage}
              alt="Product preview"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
}
