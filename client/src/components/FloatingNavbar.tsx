import React from 'react';
import { useLocation } from 'wouter';
import { Home, Info, Mail, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingNavbar = () => {
  const [location] = useLocation();

  const navItems = [
    { name: 'Home', section: 'home', icon: Home },
    { name: 'About', section: 'about', icon: Info },
    { name: 'Admin', section: null, icon: User, isPlaceholder: true },
    { name: 'Contact', section: 'contact', icon: Mail },
    { name: 'Shop', section: 'shop', icon: ShoppingBag },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      window.location.href = '/#' + sectionId;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-lg">
      <nav className={cn(
        "relative flex items-center justify-between px-6 py-3 rounded-full",
        "bg-slate-900/40 backdrop-blur-xl border border-white/10",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
        "after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_20px_rgba(34,211,238,0.2)] after:-z-10"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPlaceholder) {
            return (
              <div
                key={item.name}
                className="relative -bottom-6 flex flex-col items-center"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50",
                  "hover:scale-110 active:scale-95 cursor-pointer"
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  {item.name}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.name}
              onClick={() => item.section && scrollToSection(item.section)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                "text-slate-400 hover:text-cyan-400 cursor-pointer"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FloatingNavbar;
