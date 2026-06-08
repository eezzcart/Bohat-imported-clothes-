import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, ArrowRight, Check, Truck, Shield, Clock, Sparkles, Send, Award, Users, TrendingUp, Filter, Zap } from 'lucide-react';

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
  // Define static data first (before useState hooks)
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
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999', color: 'from-cyan-500 to-blue-500' },
    { icon: Shield, title: 'Authentic Quality', desc: 'Guaranteed imported products', color: 'from-blue-500 to-indigo-500' },
    { icon: Clock, title: 'Fast Delivery', desc: '5-7 business days', color: 'from-indigo-500 to-purple-500' },
    { icon: Check, title: 'Secure Checkout', desc: '100% safe transactions', color: 'from-cyan-400 to-blue-600' },
  ];

  // Now define state hooks
  const [activeSection, setActiveSection] = useState('home');
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [customerReviews, setCustomerReviews] = useState<Testimonial[]>(testimonials);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);

  

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
    console.log('Contact form submitted:', contactForm);
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', message: '', subject: 'General Inquiry' });
    }, 3000);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Testimonial = {
      id: customerReviews.length + 1,
      name: reviewForm.name,
      rating: reviewForm.rating,
      text: reviewForm.text,
      image: reviewForm.image
    };
    setCustomerReviews([newReview, ...customerReviews]);
    console.log('Review submitted:', newReview);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewForm({ name: '', email: '', rating: 5, text: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' });
      setShowReviewForm(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 overflow-x-hidden">
      {/* Animated background lightning effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Bubble Navigation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed right-6 bottom-6 z-40 hidden lg:block"
      >
        <AnimatePresence>
          {showBubbleMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute bottom-24 right-0 flex flex-col gap-3"
            >
              {['Home', 'About', 'Contact'].map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, x: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    scrollToSection(item.toLowerCase());
                    setShowBubbleMenu(false);
                  }}
                  className={`w-14 h-14 rounded-full font-semibold text-sm transition flex items-center justify-center shadow-lg transition-all ${
                    activeSection === item.toLowerCase()
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/50'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-cyan-300 hover:shadow-cyan-500/30'
                  }`}
                  title={item}
                >
                  {item.charAt(0)}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowBubbleMenu(!showBubbleMenu)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/50 flex items-center justify-center font-bold text-xl transition hover:shadow-cyan-500/70"
        >
          <motion.div
            animate={{ rotate: showBubbleMenu ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showBubbleMenu ? <X size={28} /> : <Menu size={28} />}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Top Announcement Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-40 bg-slate-900/60 border-b border-cyan-500/30 backdrop-blur-xl py-3 text-center text-sm font-medium sticky top-0"
      >
        <span className="text-slate-200 flex items-center justify-center gap-2">
          <Zap size={16} className="text-cyan-400" />
          ✓ Free Shipping Above ₹999 | ✓ Authentic Imported Clothing | ✓ Premium Quality Guaranteed
          <Zap size={16} className="text-cyan-400" />
        </span>
      </motion.div>

      {/* Floating Header */}
      <header className="sticky top-12 z-50 bg-slate-900/40 border-b border-cyan-500/20 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg transition hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center md:flex-none cursor-pointer"
            >
              <img src="/assets/logo.jpg" alt="BHAT Logo" className="h-12 mx-auto drop-shadow-lg" />
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg transition hidden md:block hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <Search size={20} className="text-cyan-400" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg transition hidden md:block hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <User size={20} className="text-cyan-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(!showCart)}
                className="p-2 rounded-lg transition relative hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <ShoppingBag size={20} className="text-cyan-400" />
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-4 pt-4 border-t border-cyan-500/20">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium text-sm transition relative ${
                  activeSection === item.toLowerCase() 
                    ? 'text-cyan-400 drop-shadow-lg drop-shadow-cyan-500/50' 
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {item}
                {activeSection === item.toLowerCase() && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50"
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
                className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-cyan-500/20"
              >
                {['Home', 'Shop', 'About', 'Contact'].map((item, i) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left font-medium transition text-slate-300 hover:text-cyan-300"
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
          {/* Hero Section */}
          <section className="relative py-16 md:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
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
                    <Zap className="w-5 h-5 text-cyan-400 drop-shadow-lg drop-shadow-cyan-500/50" />
                    <span className="text-sm font-semibold text-cyan-400">Welcome to BHAT</span>
                  </motion.div>

                  <motion.h1 
                    className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight text-slate-50"
                    whileHover={{ scale: 1.02 }}
                  >
                    Bhat Imported <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">Clothes</span>
                  </motion.h1>
                  <p className="text-lg mb-4 font-medium text-slate-300 flex items-center gap-2">
                    <MapPin size={20} className="text-cyan-400" /> Singhpora Pattan, J&K
                  </p>
                  <p className="text-base mb-6 leading-relaxed text-slate-400">
                    Welcome to BHAT Imported Clothes – your ultimate destination for authentic, premium imported fashion. Since 2020, we've been dedicated to bringing you the finest clothing from around the world, carefully curated and quality-tested to ensure you get nothing but the best.
                  </p>
                  <p className="text-base mb-6 leading-relaxed text-slate-400">
                    We believe that great fashion should be accessible to everyone. Our mission is simple: deliver authentic imported clothing at competitive prices without compromising on quality. Every piece in our collection tells a story of craftsmanship, style, and excellence.
                  </p>
                  <p className="text-base mb-8 leading-relaxed text-slate-400">
                    Whether you're looking for premium denim, elegant blazers, comfortable hoodies, or casual wear, BHAT has something special for you. Experience the difference that authentic imported fashion can make in your wardrobe.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('shop')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/50 border border-cyan-400/50"
                  >
                    Shop Now <ArrowRight size={18} />
                  </motion.button>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ rotateY: 10, rotateX: -5 }}
                  className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/30"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  <img
                    src="https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=600&h=600&fit=crop&q=80"
                    alt="Hero Fashion"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Why BHAT Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center"
              >
                <h2 className="text-4xl font-bold mb-4 text-slate-50">Why Choose BHAT?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">We're not just another clothing store. We're a community of fashion enthusiasts dedicated to bringing you authentic, premium imported clothing with exceptional service and unbeatable prices.</p>
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
                      className="p-6 rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/60 transition shadow-lg hover:shadow-cyan-500/30"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold mb-2 text-sm text-slate-50">{feature.title}</h3>
                      <p className="text-xs text-slate-400">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Premium Promise Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center"
              >
                <h2 className="text-4xl font-bold mb-4 text-slate-50">Our Premium Promise</h2>
                <p className="text-slate-400">What sets BHAT apart from the rest</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-3 mb-4 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-50">Curated Collection</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Every item in our collection is hand-picked and quality-tested. We work directly with international suppliers to ensure authenticity and premium quality. No compromises, no shortcuts – just pure fashion excellence.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3 mb-4 flex items-center justify-center text-white shadow-lg">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-50">Best Value Guarantee</h3>
                  <p className="text-slate-400 leading-relaxed">
                    We believe premium quality shouldn't break the bank. Our competitive pricing strategy ensures you get the best value for your money. Compare us with anyone – we're confident you'll find us unbeatable.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-3 mb-4 flex items-center justify-center text-white shadow-lg">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-50">Community Driven</h3>
                  <p className="text-slate-400 leading-relaxed">
                    We're more than just a store – we're a community. Our customers are our family. We listen to your feedback, understand your needs, and continuously improve to serve you better. Your satisfaction is our success.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 p-3 mb-4 flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-50">Lightning Fast Service</h3>
                  <p className="text-slate-400 leading-relaxed">
                    From order processing to delivery, we keep things moving. Our efficient logistics network ensures your fashion reaches you quickly. Plus, our responsive customer support is always ready to help.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center"
              >
                <h2 className="text-4xl font-bold mb-4 text-slate-50">Shop by Category</h2>
                <p className="text-slate-400">Explore our diverse collection of premium imported clothing</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.slice(1, 5).map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group border border-cyan-500/20 shadow-lg hover:shadow-cyan-500/40"
                    onClick={() => scrollToSection('shop')}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm text-slate-200">{category.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl backdrop-blur-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 p-12 text-center shadow-2xl shadow-cyan-500/20"
              >
                <h2 className="text-4xl font-bold mb-4 text-slate-50">Ready to Elevate Your Style?</h2>
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                  Discover our exclusive collection of authentic imported clothing. From casual wear to formal attire, find everything you need to express your unique style.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('shop')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold transition flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/50 border border-cyan-400/50 mx-auto"
                >
                  Explore Collection <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center"
              >
                <h2 className="text-4xl font-bold mb-4 text-slate-50">Loved by Customers</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Join thousands of satisfied customers who have transformed their wardrobes with BHAT Imported Clothes. Read their real stories and see why they keep coming back.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {customerReviews.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/60 shadow-lg hover:shadow-cyan-500/40 transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-50">{testimonial.name}</h4>
                          <div className="flex gap-0.5">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" className="text-cyan-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="leading-relaxed text-slate-400">"{testimonial.text}"</p>
                    </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* SHOP SECTION */}
      {activeSection === 'shop' && (
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-2 text-slate-50">Shop Our Collection</h2>
              <p className="text-slate-400">Browse and filter our premium imported clothing collection</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-6 h-fit shadow-lg"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-cyan-400" />
                  <h3 className="text-lg font-bold text-slate-50">Filters</h3>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-2 block text-slate-300">Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block text-slate-300">Category</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.name}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === cat.name
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        {cat.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block text-slate-300">Price Range</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full accent-cyan-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-cyan-500"
                    />
                    <div className="text-sm font-semibold text-cyan-400">
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
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  Reset Filters
                </motion.button>
              </motion.div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-semibold mb-6 text-slate-400"
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
                      className="rounded-2xl overflow-hidden backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 hover:bg-slate-900/60 transition group shadow-lg hover:shadow-cyan-500/40"
                    >
                      <div className="relative h-64 overflow-hidden bg-slate-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition group-hover:scale-110"
                          loading="lazy"
                        />
                        {product.badge && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-cyan-500/50"
                          >
                            {product.badge}
                          </motion.div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm shadow-lg transition hover:bg-slate-900 border border-cyan-500/30"
                        >
                          <Heart
                            size={18}
                            className={favorites.includes(product.id) ? 'fill-cyan-400 text-cyan-400' : 'text-slate-400'}
                          />
                        </motion.button>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2 text-slate-50">{product.name}</h3>
                        <p className="text-sm mb-4 text-slate-400">{product.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                          {product.rating && (
                            <div className="flex gap-1">
                              {[...Array(product.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" className="text-cyan-400" />
                              ))}
                            </div>
                          )}
                          <span className="text-xs text-slate-400">
                            ({product.rating} stars)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-cyan-400">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-slate-500">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addToCart(product)}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium transition hover:shadow-lg hover:shadow-cyan-500/50"
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
                    <p className="text-lg font-semibold text-slate-400">
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
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-slate-50">About BHAT</h2>
              <p className="text-slate-400">Learn about our journey and mission</p>
            </motion.div>

            {/* About Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">Our Story</h3>
                <p className="mb-4 leading-relaxed text-slate-400">
                  BHAT Imported Clothes was founded with a simple mission: to bring authentic, premium imported fashion to customers in Kashmir and beyond. We started as a small boutique in Singhpora Pattan and have grown into a trusted name in imported clothing.
                </p>
                <p className="mb-4 leading-relaxed text-slate-400">
                  Our commitment to quality, authenticity, and customer satisfaction has made BHAT Imported Clothes the go-to destination for imported fashion enthusiasts. We work directly with international suppliers to ensure every piece meets our high standards.
                </p>
                <p className="leading-relaxed text-slate-400">
                  Today, we serve thousands of happy customers across India, delivering premium fashion with the personal touch that makes BHAT Imported Clothes special.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-6 text-cyan-400">Our Values</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <Check size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-50">Authenticity</h4>
                      <p className="text-sm text-slate-400">Every product is 100% authentic and verified</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-50">Quality</h4>
                      <p className="text-sm text-slate-400">We maintain the highest quality standards</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-50">Customer Focus</h4>
                      <p className="text-sm text-slate-400">Your satisfaction is our top priority</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-50">Innovation</h4>
                      <p className="text-sm text-slate-400">We continuously improve our services</p>
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
                  className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-6 text-center shadow-lg hover:shadow-cyan-500/30"
                >
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-slate-50">Customer Reviews</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  {showReviewForm ? 'Close' : '+ Share Your Review'}
                </motion.button>
              </div>

              {/* Review Submission Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 mb-8 shadow-lg"
                  >
                    <h4 className="text-2xl font-bold mb-6 text-slate-50">Share Your Experience</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold mb-2 block text-slate-300">Your Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={reviewForm.name}
                            onChange={handleReviewChange}
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block text-slate-300">Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            value={reviewForm.email}
                            onChange={handleReviewChange}
                            required
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block text-slate-300">Rating *</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                              className={`text-3xl transition ${
                                star <= reviewForm.rating ? 'text-cyan-400' : 'text-slate-600'
                              }`}
                            >
                              ★
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block text-slate-300">Your Review *</label>
                        <textarea
                          name="text"
                          value={reviewForm.text}
                          onChange={handleReviewChange}
                          required
                          placeholder="Share your experience with BHAT Imported Clothes..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition resize-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Submit Review
                      </motion.button>

                      <AnimatePresence>
                        {reviewSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-4 py-3 rounded-lg text-center font-semibold"
                          >
                            ✓ Thank you! Your review has been submitted successfully.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerReviews.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 shadow-lg hover:shadow-cyan-500/30"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-50">{testimonial.name}</h4>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" className="text-cyan-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="leading-relaxed text-slate-400">{testimonial.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      {activeSection === 'contact' && (
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl font-bold mb-4 text-slate-50">Get in Touch</h2>
              <p className="text-slate-400">We're here to help and answer any questions about our products</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 text-center shadow-lg hover:shadow-cyan-500/40"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-3 mb-4 flex items-center justify-center text-white mx-auto shadow-lg">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-50">Call Us</h3>
                <p className="font-medium mb-2 text-cyan-400">9103174217</p>
                <p className="text-sm text-slate-400">Available 9 AM - 9 PM IST</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 text-center shadow-lg hover:shadow-cyan-500/40"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 p-3 mb-4 flex items-center justify-center text-white mx-auto shadow-lg">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-50">WhatsApp</h3>
                <p className="font-medium mb-2 text-cyan-400">8899507736</p>
                <p className="text-sm text-slate-400">Quick responses guaranteed</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 text-center shadow-lg hover:shadow-cyan-500/40"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3 mb-4 flex items-center justify-center text-white mx-auto shadow-lg">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-50">Email</h3>
                <p className="font-medium text-sm mb-2 text-cyan-400">saqiblateef123456@gmail.com</p>
                <p className="text-sm text-slate-400">Response within 24 hours</p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl backdrop-blur-xl border border-cyan-500/30 bg-slate-900/40 p-8 max-w-2xl mx-auto shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-50">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      required
                      placeholder="Your phone number"
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-slate-300">Subject *</label>
                    <select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
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
                  <label className="text-sm font-semibold mb-2 block text-slate-300">Message *</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-cyan-500/30 bg-slate-800/50 text-white placeholder-slate-500 transition resize-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/30"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
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
                      className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-4 py-3 rounded-lg text-center font-semibold"
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
      <footer className="bg-slate-950/80 border-t border-cyan-500/30 backdrop-blur-xl py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-cyan-400">BHAT IMPORTED CLOTHES</h3>
              <p className="text-sm text-slate-400">
                Bhat imported clothing with authentic quality and competitive pricing. Your trusted fashion destination since 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-50">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><motion.button onClick={() => scrollToSection('home')} className="hover:text-cyan-400 transition">Home</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('shop')} className="hover:text-cyan-400 transition">Shop</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition">About</motion.button></li>
                <li><motion.button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition">Contact</motion.button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-50">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Returns</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-50">Follow Us</h4>
              <div className="flex gap-4">
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="https://www.instagram.com/bhat_imported_clothess" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="#" 
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2 }}
                  href="#" 
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  <Twitter size={20} />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-cyan-500/30 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 BHAT IMPORTED CLOTHES. All rights reserved. | Singhpora Pattan, J&K | Authentic Fashion Since 2020</p>
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
            className="fixed right-0 top-0 h-full w-full md:w-96 z-50 overflow-y-auto shadow-2xl shadow-cyan-500/30 bg-slate-900/95 border-l border-cyan-500/30 backdrop-blur-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">Cart</h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCart(false)} 
                  className="p-2 rounded-lg transition hover:bg-slate-800/50"
                >
                  <X size={24} />
                </motion.button>
              </div>
              {cart.length === 0 ? (
                <motion.p 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center py-8 text-slate-400"
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
                        className="flex gap-4 pb-4 border-b border-cyan-500/30"
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-50">{item.name}</p>
                          <p className="font-bold text-cyan-400">₹{item.price.toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-cyan-500/30 pt-4 mb-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold text-slate-50">Total:</span>
                      <span className="font-bold text-lg text-cyan-400">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold transition hover:shadow-lg hover:shadow-cyan-500/50"
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
