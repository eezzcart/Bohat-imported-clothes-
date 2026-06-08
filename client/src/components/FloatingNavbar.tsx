import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Info, Mail, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingNavbar = () => {
  const [location] = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Admin', path: '#', icon: User, isPlaceholder: true },
    { name: 'Contact', path: '/contact', icon: Mail },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg">
      <nav className={cn(
        "relative flex items-center justify-between px-6 py-3 rounded-full",
        "bg-white/10 backdrop-blur-xl border border-white/20",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_15px_rgba(59,130,246,0.5)] after:-z-10"
      )}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          if (item.isPlaceholder) {
            return (
              <div
                key={item.name}
                className="relative -top-6 flex flex-col items-center"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50",
                  "hover:scale-110 active:scale-95 cursor-pointer"
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="mt-1 text-[10px] font-medium text-blue-500 uppercase tracking-wider">
                  {item.name}
                </span>
              </div>
            );
          }

          return (
            <Link key={item.name} href={item.path}>
              <a className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                "text-gray-400 hover:text-blue-500",
                isActive && "text-blue-500 scale-110"
              )}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {item.name}
                </span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingNavbar;
