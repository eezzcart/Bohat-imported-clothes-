import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingBag, Tag, LogOut } from 'lucide-react';
import { useAuth } from "@/_core/hooks/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();
  const links = [
    { to: '', icon: LayoutDashboard, label: 'Dashboard' },
    { to: 'products', icon: ShoppingBag, label: 'Products' },
    { to: 'products/add', icon: PackagePlus, label: 'Add Product' },
    { to: 'categories', icon: Tag, label: 'Categories' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">ShopAdmin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ''}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4 space-y-2">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
        <p className="px-3 text-xs text-slate-400">© 2026 ShopAdmin v1.0</p>
      </div>
    </aside>
  );
}
