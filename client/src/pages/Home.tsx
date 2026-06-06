import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, ArrowRight, Check, Truck, Shield, Clock } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  badge?: string;
}

interface Category {
  name: string;
  image: string;
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
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
      category: 'Jackets',
      rating: 5,
      badge: 'BESTSELLER',
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
    },
    {
      id: 3,
      name: 'Premium Slim Fit Jeans',
      price: 1800,
      originalPrice: 2500,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      category: 'Jeans',
      rating: 5,
    },
    {
      id: 4,
      name: 'Minimalist Casual Shirt',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=400&h=400&fit=crop',
      category: 'Shirts',
      rating: 4,
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
    },
    {
      id: 6,
      name: 'Formal Blazer',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1591047990635-eea47cdc2e5e?w=400&h=400&fit=crop',
      category: 'Blazers',
      rating: 5,
    },
  ];

  const categories: Category[] = [
    { name: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop' },
    { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
    { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop' },
    { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=300&h=300&fit=crop' },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ahmed Khan',
      rating: 5,
      text: 'Exceptional quality and authentic pieces. The attention to detail is impressive.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Fatima Malik',
      rating: 5,
      text: 'Fast delivery and great customer service. Highly recommend for imported fashion.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      rating: 5,
      text: 'Best quality-to-price ratio I\'ve found. Will definitely shop again.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Zara Khan',
      rating: 5,
      text: 'Amazing collection with authentic imported pieces. Seamless shopping experience.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
    { icon: Shield, title: 'Authentic Quality', desc: 'Guaranteed imported products' },
    { icon: Clock, title: 'Fast Delivery', desc: '5-7 business days' },
    { icon: Check, title: 'Secure Checkout', desc: '100% safe transactions' },
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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-50' : 'bg-white text-slate-900'}`}>
      {/* Top Announcement Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} border-b py-3 text-center text-sm font-medium`}
      >
        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
          ✓ Free Shipping Above ₹999 | ✓ Authentic Imported Clothing | ✓ Premium Quality Guaranteed
        </span>
      </motion.div>

      {/* Header */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold tracking-tight flex-1 text-center md:flex-none cursor-pointer"
            >
              BHAT
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition hidden md:block ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <Search size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition hidden md:block ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <User size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(!showCart)}
                className={`p-2 rounded-lg transition relative ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-4 pt-4 border-t border-slate-200">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium text-sm transition ${
                  activeSection === item.toLowerCase() 
                    ? 'text-slate-900 border-b-2 border-slate-900' 
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item}
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
                className={`md:hidden flex flex-col gap-3 mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}
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

      {/* Hero Section */}
      <section className={`relative py-16 md:py-24 overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight"
                whileHover={{ scale: 1.02 }}
              >
                Premium Imported <span className="block mt-2">Fashion</span>
              </motion.h1>
              <p className={`text-lg mb-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Singhpora Pattan, J&K
              </p>
              <p className={`text-base mb-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                Authentic imported clothing with uncompromising quality and competitive pricing.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 hover:bg-slate-800"
              >
                Shop Now <ArrowRight size={18} />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`relative h-96 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} shadow-lg`}
            >
              <img
                src="https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=500&h=500&fit=crop"
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl text-center transition ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-slate-900 dark:text-slate-100" />
                  <h3 className="font-semibold mb-1 text-sm">{feature.title}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2">Featured Collection</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Curated pieces for the modern wardrobe</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl overflow-hidden transition ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:shadow-lg'}`}
              >
                <div className={`relative h-64 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition hover:scale-105"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-lg transition"
                  >
                    <Heart
                      size={18}
                      className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                    />
                  </motion.button>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
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
                    <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
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
                    className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium transition hover:bg-slate-800"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2">Loved by Customers</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Real reviews from real customers</p>
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
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} transition`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
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
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2">Get in Touch</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>We're here to help and answer any questions</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.a
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="tel:9103174217"
              className={`p-8 rounded-xl text-center transition ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-lg'}`}
            >
              <Phone className="w-8 h-8 mx-auto mb-4 text-slate-900 dark:text-slate-100" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">9103174217</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="https://wa.me/8899507736"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 rounded-xl text-center transition ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-lg'}`}
            >
              <Phone className="w-8 h-8 mx-auto mb-4 text-slate-900 dark:text-slate-100" />
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">8899507736</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:saqiblateef123456@gmail.com"
              className={`p-8 rounded-xl text-center transition ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-lg'}`}
            >
              <Mail className="w-8 h-8 mx-auto mb-4 text-slate-900 dark:text-slate-100" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">saqiblateef123456@gmail.com</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-900 text-white'} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">BHAT</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
                Premium imported clothing with authentic quality and competitive pricing.
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

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`fixed right-0 top-0 h-full w-full md:w-96 z-50 overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'} border-l`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Cart</h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCart(false)} 
                  className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
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
                        className={`flex gap-4 pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-slate-600 dark:text-slate-400 font-bold">₹{item.price.toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-4 mb-4`}>
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold transition hover:bg-slate-800"
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
