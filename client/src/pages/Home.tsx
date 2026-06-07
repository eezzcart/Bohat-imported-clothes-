import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, ArrowRight, Check, Truck, Shield, Clock, Sparkles, Send, Award, Users, TrendingUp, Filter } from 'lucide-react';

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

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Shop filter states
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Contact form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const products: Product[] = [
    {
      id: 1,
      name: 'Premium Denim Jacket',
      price: 2500,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop&q=80',
      category: 'Jackets',
      rating: 5,
      badge: 'BESTSELLER',
      description: 'Authentic imported denim jacket with premium quality stitching and timeless design. Perfect for any season.',
    },
    {
      id: 2,
      name: 'Classic Organic T-Shirt',
      price: 800,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80',
      category: 'T-Shirts',
      rating: 5,
      badge: 'NEW',
      description: 'Eco-friendly organic cotton t-shirt perfect for everyday wear. Comfortable and sustainable.',
    },
    {
      id: 3,
      name: 'Premium Slim Fit Jeans',
      price: 1800,
      originalPrice: 2500,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop&q=80',
      category: 'Jeans',
      rating: 5,
      description: 'Comfortable slim fit jeans with superior fabric quality and durability. A wardrobe essential.',
    },
    {
      id: 4,
      name: 'Minimalist Casual Shirt',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=500&h=500&fit=crop&q=80',
      category: 'Shirts',
      rating: 4,
      description: 'Versatile casual shirt that works for any occasion with clean minimalist design.',
    },
    {
      id: 5,
      name: 'Sustainable Hoodie',
      price: 1500,
      originalPrice: 2200,
      image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=500&h=500&fit=crop&q=80',
      category: 'Hoodies',
      rating: 5,
      badge: 'ECO',
      description: 'Sustainable hoodie made from eco-friendly materials with ultimate comfort and style.',
    },
    {
      id: 6,
      name: 'Formal Blazer',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1591047990635-eea47cdc2e5e?w=500&h=500&fit=crop&q=80',
      category: 'Blazers',
      rating: 5,
      description: 'Premium formal blazer perfect for professional and special occasions.',
    },
    {
      id: 7,
      name: 'Cotton Polo Shirt',
      price: 950,
      originalPrice: 1400,
      image: 'https://images.unsplash.com/photo-1578761681033-6461ffad8d80?w=500&h=500&fit=crop&q=80',
      category: 'Shirts',
      rating: 4,
      description: 'Classic cotton polo shirt with premium finish. Great for casual or semi-formal wear.',
    },
    {
      id: 8,
      name: 'Winter Parka Jacket',
      price: 4200,
      originalPrice: 5500,
      image: 'https://images.unsplash.com/photo-1539533057440-7814baea1002?w=500&h=500&fit=crop&q=80',
      category: 'Jackets',
      rating: 5,
      badge: 'PREMIUM',
      description: 'Luxurious winter parka jacket with premium insulation and water-resistant coating.',
    },
  ];

  const categories: Category[] = [
    { name: 'All', image: 'https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=400&h=400&fit=crop&q=80', description: 'All products' },
    { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop&q=80', description: 'Premium imported jackets' },
    { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80', description: 'Comfortable everyday wear' },
    { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop&q=80', description: 'Authentic denim collection' },
    { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=400&h=400&fit=crop&q=80', description: 'Cozy and stylish hoodies' },
    { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=400&h=400&fit=crop&q=80', description: 'Casual and formal shirts' },
    { name: 'Blazers', image: 'https://images.unsplash.com/photo-1591047990635-eea47cdc2e5e?w=400&h=400&fit=crop&q=80', description: 'Professional blazers' },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmed Khan',
      rating: 5,
      text: 'Exceptional quality and authentic pieces. The attention to detail is impressive. I\'ve been a customer for 2 years now and never disappointed. The customer service is outstanding!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Fatima Malik',
      rating: 5,
      text: 'Fast delivery and great customer service. Highly recommend for imported fashion. The packaging is also premium quality. Everything arrived perfectly!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      rating: 5,
      text: 'Best quality-to-price ratio I\'ve found. Will definitely shop again. The items are exactly as described in the listing. Absolutely worth it!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Zara Khan',
      rating: 5,
      text: 'Amazing collection with authentic imported pieces. Seamless shopping experience from start to finish. Highly satisfied with my purchases!',
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

  // Filter products based on price, category, and search
  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPrice && matchesCategory && matchesSearch;
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact form submitted:', contactForm);
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', message: '', subject: 'General Inquiry' });
    }, 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50 text-slate-900'}`}>
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

            {/* Logo with Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center md:flex-none cursor-pointer"
            >
              <img src="/assets/logo.jpg" alt="BHAT Logo" className="h-12 mx-auto" />
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

      {/* HOME SECTION */}
      {activeSection === 'home' && (
        <>
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
                    Bhat Imported <span className="block mt-2">Clothes</span>
                  </motion.h1>
                  <p className={`text-lg mb-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    📍 Singhpora Pattan, J&K
                  </p>
                  <p className={`text-base mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Discover authentic Bhat imported clothes with uncompromising quality and competitive pricing. We bring you the finest fashion from around the world, curated specially for you. Experience the difference of genuine imported fashion.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('shop')}
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
                    src="https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=600&h=600&fit=crop&q=80"
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section with Glassmorphism */}
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
                {categories.slice(1, 5).map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer group`}
                    onClick={() => scrollToSection('shop')}
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

          {/* Testimonials Section with Glassmorphism */}
          <section className={`py-20`}>
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
        </>
      )}

      {/* SHOP SECTION */}
      {activeSection === 'shop' && (
        <section className={`py-20`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shop Our Collection</h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Browse and filter our premium imported clothing collection</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl backdrop-blur-xl border p-6 h-fit ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} />
                  <h3 className="text-lg font-bold">Filters</h3>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-2 block">Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-white/50 border-white/60 text-slate-900'}`}
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block">Category</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.name}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === cat.name
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-white/50'
                        }`}
                      >
                        {cat.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block">Price Range</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold transition hover:shadow-lg"
                >
                  Reset Filters
                </motion.button>
              </motion.div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm font-semibold mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Showing {filteredProducts.length} products
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -10 }}
                      transition={{ delay: index * 0.05 }}
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

                {filteredProducts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      No products found matching your filters
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      {activeSection === 'about' && (
        <section className={`py-20`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">About BHAT</h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Learn about our journey and mission</p>
            </motion.div>

            {/* About Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl backdrop-blur-xl border p-8 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Story</h3>
                <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  BHAT Imported Clothes was founded with a simple mission: to bring authentic, premium imported fashion to customers in Kashmir and beyond. We started as a small boutique in Singhpora Pattan and have grown into a trusted name in imported clothing.
                </p>
                <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Our commitment to quality, authenticity, and customer satisfaction has made BHAT Imported Clothes the go-to destination for imported fashion enthusiasts. We work directly with international suppliers to ensure every piece meets our high standards.
                </p>
                <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Today, we serve thousands of happy customers across India, delivering premium fashion with the personal touch that makes BHAT Imported Clothes special.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-2xl backdrop-blur-xl border p-8 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Values</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                      <Check size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Authenticity</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Every product is 100% authentic and verified</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Quality</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>We maintain the highest quality standards</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white flex-shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Customer Focus</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Your satisfaction is our top priority</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Innovation</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>We continuously improve our services</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {[
                { label: 'Happy Customers', value: '5000+' },
                { label: 'Products', value: '500+' },
                { label: 'Years Experience', value: '5+' },
                { label: 'Cities Served', value: '50+' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl backdrop-blur-xl border p-6 text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customer Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-2xl backdrop-blur-xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" className="text-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{testimonial.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      {activeSection === 'contact' && (
        <section className={`py-20`}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get in Touch</h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>We're here to help and answer any questions about our products</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl backdrop-blur-xl border p-8 text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-3 mb-4 flex items-center justify-center text-white mx-auto">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>9103174217</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Available 9 AM - 9 PM IST</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl backdrop-blur-xl border p-8 text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-3 mb-4 flex items-center justify-center text-white mx-auto">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                <p className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>8899507736</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Quick responses guaranteed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl backdrop-blur-xl border p-8 text-center ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-3 mb-4 flex items-center justify-center text-white mx-auto">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className={`font-medium text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>saqiblateef123456@gmail.com</p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Response within 24 hours</p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl backdrop-blur-xl border p-8 max-w-2xl mx-auto ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white/40 border-white/60'}`}
            >
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      placeholder="Your name"
                      className={`w-full px-4 py-3 rounded-lg border transition ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/50 border-white/60 text-slate-900 placeholder-slate-500'}`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg border transition ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/50 border-white/60 text-slate-900 placeholder-slate-500'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      required
                      placeholder="Your phone number"
                      className={`w-full px-4 py-3 rounded-lg border transition ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/50 border-white/60 text-slate-900 placeholder-slate-500'}`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Subject *</label>
                    <select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      className={`w-full px-4 py-3 rounded-lg border transition ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-white/50 border-white/60 text-slate-900'}`}
                    >
                      <option>General Inquiry</option>
                      <option>Product Question</option>
                      <option>Order Issue</option>
                      <option>Return/Exchange</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Message *</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border transition resize-none ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-white/50 border-white/60 text-slate-900 placeholder-slate-500'}`}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>

                <AnimatePresence>
                  {contactSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-center font-semibold"
                    >
                      ✓ Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-slate-950/80 border-slate-900/50' : 'bg-gradient-to-b from-slate-900 to-slate-950 text-white'} border-t backdrop-blur-xl py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BHAT IMPORTED CLOTHES</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                Bhat imported clothing with authentic quality and competitive pricing. Your trusted fashion destination since 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                <li><motion.button onClick={() => scrollToSection('home')} className="hover:text-white transition">Home</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('shop')} className="hover:text-white transition">Shop</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('about')} className="hover:text-white transition">About</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('contact')} className="hover:text-white transition">Contact</motion.button></li>
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
            <p>&copy; 2026 BHAT IMPORTED CLOTHES. All rights reserved. | Singhpora Pattan, J&K | Authentic Fashion Since 2020</p>
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
