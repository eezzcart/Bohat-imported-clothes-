import { useMemo } from 'react';
import { Tag } from 'lucide-react';
import { getProducts } from '../lib/storage';

export default function Categories() {
  const products = useMemo(() => getProducts(), []);

  const categoryData = useMemo(() => {
    const map: Record<string, { count: number; stock: number; value: number }> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = { count: 0, stock: 0, value: 0 };
      map[p.category].count += 1;
      map[p.category].stock += p.stock;
      map[p.category].value += p.price * p.stock;
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [products]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Product categories and their stats.</p>
      </div>

      {categoryData.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryData.map(([name, data]) => (
            <div
              key={name}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                  <Tag className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{name}</h3>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">{data.count}</p>
                  <p className="text-xs text-slate-400">Products</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">{data.stock}</p>
                  <p className="text-xs text-slate-400">In Stock</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-slate-900">
                    ${data.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
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
          <p className="mt-1 text-xs text-slate-400">Add some products to see category breakdowns.</p>
        </div>
      )}
    </div>
  );
}
