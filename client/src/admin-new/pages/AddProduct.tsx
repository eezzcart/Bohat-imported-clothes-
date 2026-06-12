import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AddProduct() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const createProductMutation = trpc.products.create.useMutation({
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  const uploadImageMutation = trpc.products.uploadImage.useMutation({
    onError: (error) => {
      toast.error(error.message || 'Failed to upload image');
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
    try {
      // Create product first
      const product = await createProductMutation.mutateAsync({
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        stock: data.stock,
        sku: data.sku,
        status: data.status,
      });

      // Upload images if any
      if (data.images.length > 0 && product && product.id) {
        for (const image of data.images) {
          if (image instanceof File) {
            await uploadImageMutation.mutateAsync({
              productId: product.id,
              imageFile: image,
            });
          }
        }
      }

      toast.success('Product created successfully');
      await utils.products.list.invalidate();
      navigate('..');
    } catch (error) {
      console.error('Error saving product:', error);
    }
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
        <ProductForm onSave={handleSave} onCancel={() => navigate('..')} />
      </div>
    </div>
  );
}
