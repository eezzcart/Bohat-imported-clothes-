import React from 'react';
import { useLocation } from 'wouter';
import { Home, Info, Mail, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingNavbar = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
  const [location] = useLocation();

  const navItems = [
    { name: 'Home', section: 'home', icon: Home },
    { name: 'About', section: 'about', icon: Info },
    { name: 'Admin', section: null, icon: User, isPlaceholder: true },
    { name: 'Contact', section: 'contact', icon: Mail },
    { name: 'Shop', section: 'shop', icon: ShoppingBag },
  ];

  const handleClick = (sectionId: string) => {
    if (location !== '/') {
      window.location.href = '/#' + sectionId;
      return;
    }
    if (onNavigate) {
      onNavigate(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Height of the fixed navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full">
      <nav className={cn(
        "flex items-center justify-between px-6 py-4 w-full",
        "bg-slate-900/80 backdrop-blur-xl border-b border-white/10",
        "shadow-lg"
      )}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              BHAT
            </span>
          </div>

          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.isPlaceholder) {
                return (
                  <div
                    key={item.name}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {item.name}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => item.section && handleClick(item.section)}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    "text-slate-400 hover:text-cyan-400 cursor-pointer group"
                  )}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default FloatingNavbar;
