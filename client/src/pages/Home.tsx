import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, ArrowRight, Check, Truck, Shield, Clock, Sparkles } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  badge?: string;
  description?: string;
}

interface Category {
  name: string;
  image: string;
  description?: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
}

// Splash Cursor Component
const SplashCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create particles on mouse move
      if (Math.random() > 0.8) {
        const newParticle = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
        };
        setParticles((prev) => [...prev, newParticle]);

        // Remove particle after animation
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none;
        }
      `}</style>
      
      {/* Main cursor */}
      <motion.div
        className="fixed w-6 h-6 border-2 border-blue-500 rounded-full pointer-events-none z-[9999]"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />

      {/* Cursor dot */}
      <motion.div
        className="fixed w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-[9999]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'spring', stiffness: 800, damping: 35 }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed w-1 h-1 bg-blue-400 rounded-full pointer-events-none z-[9998]"
          initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 100,
            y: particle.y + (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </>
  );
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const products: Product[] = [
    {
      id: 1,
      name: 'Premium Denim Jacket',
      price: 2500,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
      category: 'Jackets',
      rating: 5,
      badge: 'BESTSELLER',
      description: 'Authentic imported denim jacket with premium quality stitching and timeless design.',
    },
    {
      id: 2,
      name: 'Classic Organic T-Shirt',
      price: 800,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'T-Shirts',
      rating: 5,
      badge: 'NEW',
      description: 'Eco-friendly organic cotton t-shirt perfect for everyday wear.',
    },
    {
      id: 3,
      name: 'Premium Slim Fit Jeans',
      price: 1800,
      originalPrice: 2500,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      category: 'Jeans',
      rating: 5,
      description: 'Comfortable slim fit jeans with superior fabric quality and durability.',
    },
    {
      id: 4,
      name: 'Minimalist Casual Shirt',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=400&h=400&fit=crop',
      category: 'Shirts',
      rating: 4,
      description: 'Versatile casual shirt that works for any occasion with clean minimalist design.',
    },
    {
      id: 5,
      name: 'Sustainable Hoodie',
      price: 1500,
      originalPrice: 2200,
      image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=400&h=400&fit=crop',
      category: 'Hoodies',
      rating: 5,
      badge: 'ECO',
      description: 'Sustainable hoodie made from eco-friendly materials with ultimate comfort.',
    },
    {
      id: 6,
      name: 'Formal Blazer',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1591047990635-eea47cdc2e5e?w=400&h=400&fit=crop',
      category: 'Blazers',
      rating: 5,
      description: 'Premium formal blazer perfect for professional and special occasions.',
    },
  ];

  const categories: Category[] = [
    { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop', description: 'Premium imported jackets' },
    { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', description: 'Comfortable everyday wear' },
    { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop', description: 'Authentic denim collection' },
    { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=300&h=300&fit=crop', description: 'Cozy and stylish hoodies' },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmed Khan',
      rating: 5,
      text: 'Exceptional quality and authentic pieces. The attention to detail is impressive. I\'ve been a customer for 2 years now and never disappointed.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Fatima Malik',
      rating: 5,
      text: 'Fast delivery and great customer service. Highly recommend for imported fashion. The packaging is also premium quality.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      rating: 5,
      text: 'Best quality-to-price ratio I\'ve found. Will definitely shop again. The items are exactly as described in the listing.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Zara Khan',
      rating: 5,
      text: 'Amazing collection with authentic imported pieces. Seamless shopping experience from start to finish. Highly satisfied!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, title: 'Authentic Quality', desc: 'Guaranteed imported products', color: 'from-purple-500 to-pink-500' },
    { icon: Clock, title: 'Fast Delivery', desc: '5-7 business days', color: 'from-orange-500 to-red-500' },
    { icon: Check, title: 'Secure Checkout', desc: '100% safe transactions', color: 'from-green-500 to-emerald-500' },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]);
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setShowMobileMenu(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 text-slate-900'}`}>
      <SplashCursor />

      {/* Top Announcement Bar with Glassmorphism */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${isDarkMode ? 'bg-slate-900/40 border-slate-700/40' : 'bg-white/40 border-white/60'} border-b backdrop-blur-xl py-3 text-center text-sm font-medium sticky top-0 z-40`}
      >
        <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
          ✓ Free Shipping Above ₹999 | ✓ Authentic Imported Clothing | ✓ Premium Quality Guaranteed
        </span>
      </motion.div>

      {/* Floating Header with Glassmorphism */}
      <header className={`sticky top-12 z-50 ${isDarkMode ? 'bg-slate-900/30 border-slate-700/30' : 'bg-white/30 border-white/60'} border-b backdrop-blur-xl transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'}`}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Logo with Gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold tracking-tight flex-1 text-center md:flex-none cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              BHAT
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition hidden md:block ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'}`}
              >
                <Search size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition hidden md:block ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'}`}
              >
                <User size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(!showCart)}
                className={`p-2 rounded-lg transition relative ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'}`}
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-4 pt-4 border-t border-slate-200/30">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium text-sm transition relative ${
                  activeSection === item.toLowerCase() 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`md:hidden flex flex-col gap-3 mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700/30' : 'border-white/30'}`}
              >
                {['Home', 'Shop', 'About', 'Contact'].map((item, i) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-left font-medium transition ${isDarkMode ? 'text-slate-300 hover:text-slate-100' : 'text-slate-700 hover:text-slate-900'}`}
                  >
                    {item}
                  </motion.button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section with 3D Perspective */}
      <section className={`relative py-16 md:py-32 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Welcome to BHAT</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Premium Imported <span className="block mt-2">Fashion</span>
              </motion.h1>
              <p className={`text-lg mb-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                📍 Singhpora Pattan, J&K
              </p>
              <p className={`text-base mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Discover authentic imported clothing with uncompromising quality and competitive pricing. We bring you the finest fashion from around the world, curated specially for you.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50"
              >
                Shop Now <ArrowRight size={18} />
              </motion.button>
            </motion.div>

            {/* 3D Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ rotateY: 10, rotateX: -5 }}
              className={`relative h-96 rounded-3xl overflow-hidden shadow-2xl`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-blue-200 to-purple-200'}`} />
              <img
                src="https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=500&h=500&fit=crop"
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Glassmorphism Cards */}
      <section className={`py-20 relative`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Why Choose BHAT?</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Experience excellence in every aspect of your shopping journey</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl backdrop-blur-xl border transition ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/20' : 'bg-gradient-to-r from-blue-100/50 to-purple-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shop by Category</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Explore our diverse collection of premium imported clothing</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer group`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section with 3D Cards */}
      <section className={`py-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured Collection</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Curated pieces for the modern wardrobe with authentic quality</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl overflow-hidden backdrop-blur-xl border transition group ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
              >
                <div className={`relative h-64 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition group-hover:scale-110"
                  />
                  {product.badge && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full"
                    >
                      {product.badge}
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg transition hover:bg-white"
                  >
                    <Heart
                      size={18}
                      className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                    />
                  </motion.button>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{product.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {product.rating && (
                      <div className="flex gap-1">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" className="text-yellow-500" />
                        ))}
                      </div>
                    )}
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      ({product.rating} stars)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className={`text-sm line-through ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium transition hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Glassmorphism */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/20' : 'bg-gradient-to-r from-blue-100/50 to-purple-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loved by Customers</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Real reviews from real customers who trust our quality</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl backdrop-blur-xl border transition ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" className="text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get in Touch</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>We're here to help and answer any questions about our products</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.a
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="tel:9103174217"
              className={`p-8 rounded-2xl text-center backdrop-blur-xl border transition ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 mb-4 flex items-center justify-center text-white mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>9103174217</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Available 9 AM - 9 PM</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/8899507736"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 rounded-2xl text-center backdrop-blur-xl border transition ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-2.5 mb-4 flex items-center justify-center text-white mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>8899507736</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quick responses guaranteed</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:saqiblateef123456@gmail.com"
              className={`p-8 rounded-2xl text-center backdrop-blur-xl border transition ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 mb-4 flex items-center justify-center text-white mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className={`font-medium text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>saqiblateef123456@gmail.com</p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>We'll respond within 24 hours</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-slate-950/80 border-slate-900/50' : 'bg-gradient-to-b from-slate-900 to-slate-950 text-white'} border-t backdrop-blur-xl py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BHAT</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                Premium imported clothing with authentic quality and competitive pricing. Your trusted fashion destination.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Shop</a></li>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="https://www.instagram.com/bhat_imported_clothess" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="#" 
                  className={`transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="#" 
                  className={`transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  <Twitter size={20} />
                </motion.a>
              </div>
            </div>
          </div>
          <div className={`border-t ${isDarkMode ? 'border-slate-900' : 'border-slate-800'} pt-8 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
            <p>&copy; 2026 BHAT IMPORTED CLOTHES. All rights reserved. | Singhpora Pattan, J&K</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar with Glassmorphism */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`fixed right-0 top-0 h-full w-full md:w-96 z-50 overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-slate-900/95 border-slate-800/50' : 'bg-white/95 border-white/60'} border-l backdrop-blur-xl`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cart</h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCart(false)} 
                  className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-white/50'}`}
                >
                  <X size={24} />
                </motion.button>
              </div>
              {cart.length === 0 ? (
                <motion.p 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Your cart is empty
                </motion.p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-4 pb-4 border-b ${isDarkMode ? 'border-slate-800/50' : 'border-white/50'}`}
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>₹{item.price.toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className={`border-t ${isDarkMode ? 'border-slate-800/50' : 'border-white/50'} pt-4 mb-4`}>
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    Checkout
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
