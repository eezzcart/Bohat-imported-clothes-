import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const productId = id ? parseInt(id, 10) : null;

  // Fetch product
  const { data: product, isLoading, isError } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: async () => {
      toast.success('Product updated successfully');
      await utils.products.list.invalidate();
      await utils.products.getById.invalidate({ id: productId! });
      navigate('..');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });

  const uploadImageMutation = trpc.products.uploadImage.useMutation({
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });

  const deleteImageMutation = trpc.products.deleteImage.useMutation({
    onSuccess: async () => {
      await utils.products.getById.invalidate({ id: productId! });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete image');
    },
  });

  async function handleSave(data: {
    name: string;
    description: string;
    price: number;
    categoryId: number | null;
    stock: number;
    sku?: string;
    status: 'active' | 'draft';
    images: (string | File)[];
  }) {
    if (!productId) return;

    try {
      // Update product
      await updateProductMutation.mutateAsync({
        id: productId,
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        stock: data.stock,
        sku: data.sku,
        status: data.status,
      });

      // Handle image uploads
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          if (image instanceof File) {
            await uploadImageMutation.mutateAsync({
              productId,
              file: image,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  if (!productId) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-slate-900">Invalid Product ID</h2>
        <p className="mt-1 text-sm text-slate-500">The product ID is invalid.</p>
        <button
          onClick={() => navigate('..')}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-slate-900">Product Not Found</h2>
        <p className="mt-1 text-sm text-slate-500">The product you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('..')}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('..')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm
          product={product}
          onSave={handleSave}
          onCancel={() => navigate('..')}
        />
      </div>
    </div>
  );
}
