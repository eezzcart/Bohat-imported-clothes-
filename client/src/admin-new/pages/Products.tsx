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
import { getProducts, deleteProduct } from '../lib/storage';
import DeleteModal from '../components/DeleteModal';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (filters.sortBy === 'price') cmp = a.price - b.price;
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
    deleteProduct(deleteTarget.id);
    setProducts(getProducts());
    setDeleteTarget(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{filtered.length} of {products.length} products</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((p) => ({ ...p, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filters.category}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-4 py-3 font-medium text-slate-500">Image</th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-slate-500 hover:text-slate-700"
                    onClick={() => toggleSort('name')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Name <SortIcon col="name" />
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-500">Category</th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-slate-500 hover:text-slate-700"
                    onClick={() => toggleSort('price')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Price <SortIcon col="price" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-slate-500 hover:text-slate-700"
                    onClick={() => toggleSort('stock')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Stock <SortIcon col="stock" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      {product.images.length > 0 ? (
                        <button onClick={() => setViewImage(product.images[0])}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                          />
                        </button>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                          <Package className="h-5 w-5 text-slate-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="mt-0.5 max-w-[200px] truncate text-xs text-slate-400">
                        {product.description}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.stock <= 10
                            ? 'bg-red-50 text-red-700'
                            : product.stock <= 30
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Package className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No products found</p>
          <p className="mt-1 text-xs text-slate-400">
            {products.length === 0
              ? 'Get started by adding your first product.'
              : 'Try adjusting your search or filters.'}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => navigate('/admin/products/add')}
              className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Product
            </button>
          )}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Image preview modal */}
      {viewImage && (
        <div
          onClick={() => setViewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="relative max-h-[85vh] max-w-[85vw]">
            <img src={viewImage} alt="Preview" className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain" />
            <button
              onClick={() => setViewImage(null)}
              className="absolute -right-3 -top-3 rounded-full bg-white p-1.5 shadow-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
