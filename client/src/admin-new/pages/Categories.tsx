import { useMemo, useState } from 'react';
import { Tag, Plus, Edit, Trash2, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Categories() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const utils = trpc.useUtils();

  // Fetch categories and products
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();

  // Mutations
  const createCategoryMutation = trpc.categories.create.useMutation({
    onSuccess: async () => {
      toast.success('Category created successfully');
      await utils.categories.list.invalidate();
      setShowAddDialog(false);
      setFormData({ name: '', description: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  const updateCategoryMutation = trpc.categories.update.useMutation({
    onSuccess: async () => {
      toast.success('Category updated successfully');
      await utils.categories.list.invalidate();
      setEditingId(null);
      setFormData({ name: '', description: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  const deleteCategoryMutation = trpc.categories.delete.useMutation({
    onSuccess: async () => {
      toast.success('Category deleted successfully');
      await utils.categories.list.invalidate();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  // Compute category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<number, { count: number; stock: number; value: number }> = {};
    
    categories.forEach((cat) => {
      stats[cat.id] = { count: 0, stock: 0, value: 0 };
    });

    products.forEach((p) => {
      if (p.categoryId && stats[p.categoryId]) {
        stats[p.categoryId].count += 1;
        stats[p.categoryId].stock += p.stock;
        stats[p.categoryId].value += parseFloat(p.price) * p.stock;
      }
    });

    return stats;
  }, [categories, products]);

  function handleSubmit() {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingId) {
      updateCategoryMutation.mutate({
        id: editingId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
    } else {
      createCategoryMutation.mutate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
    }
  }

  function handleEdit(category: any) {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddDialog(false);
    setFormData({ name: '', description: '' });
  }

  const categoriesWithStats = categories.map((cat) => ({
    ...cat,
    stats: categoryStats[cat.id] || { count: 0, stock: 0, value: 0 },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Manage product categories.</p>
        </div>
        <button
          onClick={() => {
            setShowAddDialog(true);
            setEditingId(null);
            setFormData({ name: '', description: '' });
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {categoriesWithStats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoriesWithStats.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                    <Tag className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-violet-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">{category.stats.count}</p>
                  <p className="text-xs text-slate-400">Products</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">{category.stats.stock}</p>
                  <p className="text-xs text-slate-400">In Stock</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">
                    ${category.stats.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-400">Value</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Tag className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No categories yet</p>
          <p className="mt-1 text-xs text-slate-400">Create your first category to get started.</p>
          <button
            onClick={() => {
              setShowAddDialog(true);
              setFormData({ name: '', description: '' });
            }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Category
          </button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {(showAddDialog || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={handleCancel}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electronics"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this category..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Delete Category?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. Products in this category will not be deleted.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCategoryMutation.mutate({ id: deleteId })}
                disabled={deleteCategoryMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
