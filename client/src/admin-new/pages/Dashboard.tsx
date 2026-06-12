import { useMemo } from 'react';
import { ShoppingBag, DollarSign, Package, Tag, TrendingUp, AlertCircle } from 'lucide-react';
import { getProducts } from '../lib/storage';

export default function Dashboard() {
  const products = useMemo(() => getProducts(), []);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const categories = [...new Set(products.map(p => p.category))].length;
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
  const lowStock = products.filter(p => p.stock <= 10).length;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: ShoppingBag, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 text-violet-600' },
    { label: 'Inventory Value', value: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Stock', value: totalStock.toLocaleString(), icon: Package, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 text-amber-600' },
    { label: 'Categories', value: categories, icon: Tag, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50 text-sky-600' },
  ];

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your product inventory and sales metrics.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, bg }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${bg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Avg price / low stock */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Quick Insights</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-slate-600">Average Price</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">${avgPrice.toFixed(2)}</span>
            </div>
            <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${lowStock > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-5 w-5 ${lowStock > 0 ? 'text-red-500' : 'text-slate-400'}`} />
                <span className="text-sm text-slate-600">Low Stock Items (≤10)</span>
              </div>
              <span className={`text-sm font-semibold ${lowStock > 0 ? 'text-red-600' : 'text-slate-900'}`}>{lowStock}</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Products by Category</h3>
          <div className="mt-4 space-y-3">
            {categoryBreakdown.slice(0, 5).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-violet-200" style={{ width: `${Math.max(count * 20, 12)}px` }} />
                  <span className="text-sm font-medium text-slate-900">{count}</span>
                </div>
              </div>
            ))}
            {categoryBreakdown.length === 0 && (
              <p className="text-sm text-slate-400">No products yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
