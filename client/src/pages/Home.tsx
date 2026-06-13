import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingNavbar from '@/components/FloatingNavbar';
import { trpc } from '@/lib/trpc';

import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight, ArrowRight, Check, Truck, Shield, Clock, Sparkles, Send, Award, Users, TrendingUp, Filter, Zap } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  category?: string;
  categoryId?: number;
  rating?: number;
  badge?: string;
  description?: string;
  stock?: number;
  status?: string;
}

interface Category {
  id?: number;
  name: string;
  image?: string;
  description?: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
}

export default function Home({ activeSection: propActiveSection, onSectionChange }: { activeSection?: string, onSectionChange?: (section: string) => void }) {

  // Fetch products and categories from database
  const { data: dbProducts = [], isLoading: productsLoading } = trpc.publicProducts.list.useQuery();
  const { data: dbCategories = [], isLoading: categoriesLoading } = trpc.publicCategories.list.useQuery();

  // Static testimonials (can be moved to DB later)
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

  // State hooks
  const activeSection = propActiveSection || 'home';
  const setActiveSection = onSectionChange || (() => {});
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Shop filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
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

  // Transform database products to display format
  const products: Product[] = dbProducts.map(p => ({
    ...p,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    image: p.primaryImageId ? `https://via.placeholder.com/500?text=${p.name}` : 'https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=500&h=500&fit=crop&q=80',
  }));

  // Build categories list with "All" option
  const categories: Category[] = [
    { name: 'All', description: 'All products' },
    ...dbCategories.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
    }))
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

  const cartTotal = cart.reduce((sum, item) => sum + (typeof item.price === 'string' ? parseFloat(item.price) : item.price), 0);

  const filteredProducts = products.filter(product => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 overflow-x-hidden pt-20">
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

      <FloatingNavbar onNavigate={scrollToSection} />

      {/* HOME SECTION */}
      {activeSection === 'home' && (
        <>
          {/* Hero Section */}
          <section id="home" className="relative py-16 md:py-32 overflow-hidden">
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
                    <span className="text-cyan-400 font-semibold">Premium Imported Fashion</span>
                  </motion.div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Authentic Style,
                    </span>
                    <br />
                    <span className="text-slate-50">Unbeatable Prices</span>
                  </h1>

                  <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                    Discover our curated collection of premium imported clothing. From casual wear to formal attire, find everything you need to elevate your wardrobe.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection('shop')}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition"
                    >
                      <ShoppingBag size={20} />
                      Shop Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection('about')}
                      className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/10 transition"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative h-96 md:h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl" />
                  <img
                    src="https://images.unsplash.com/photo-1595777707802-21b287e3f0c8?w=500&h=500&fit=crop&q=80"
                    alt="Fashion"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition"
                  >
                    <feature.icon className={`w-12 h-12 mb-4 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Shop Section */}
          <section id="shop" className="py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Our Collection
                  </span>
                </h2>
                <p className="text-slate-400 text-lg">Browse our premium selection of imported fashion</p>
              </motion.div>

              {/* Filters */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No products found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition"
                    >
                      <div className="relative h-64 bg-slate-700 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-4 right-4 p-2 bg-slate-900/80 rounded-full hover:bg-cyan-500 transition"
                        >
                          <Heart
                            size={20}
                            className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}
                          />
                        </motion.button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-cyan-400">
                              ₹{typeof product.price === 'string' ? parseFloat(product.price) : product.price}
                            </p>
                          </div>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star size={16} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                          className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Customer Reviews
                  </span>
                </h2>
                <p className="text-slate-400 text-lg">See what our customers say about us</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {customerReviews.slice(0, 4).map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold">{review.name}</p>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{review.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  Leave a Review
                </motion.button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Get in Touch
                  </span>
                </h2>
                <p className="text-slate-400 text-lg">Have questions? We'd love to hear from you</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center"
                >
                  <Phone className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                  <h3 className="font-bold mb-2">Phone</h3>
                  <p className="text-slate-400">+91 (555) 123-4567</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center"
                >
                  <Mail className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                  <h3 className="font-bold mb-2">Email</h3>
                  <p className="text-slate-400">info@bohat.com</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center"
                >
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                  <h3 className="font-bold mb-2">Location</h3>
                  <p className="text-slate-400">India</p>
                </motion.div>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                onSubmit={handleContactSubmit}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 mb-6"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 mb-6"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>

                {contactSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center"
                  >
                    Message sent successfully!
                  </motion.div>
                )}
              </motion.form>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-slate-900 border-t border-slate-700 py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">About Bohat</h3>
                  <p className="text-slate-400 text-sm">Premium imported fashion at unbeatable prices.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li><a href="#shop" className="hover:text-cyan-400 transition">Shop</a></li>
                    <li><a href="#about" className="hover:text-cyan-400 transition">About</a></li>
                    <li><a href="#contact" className="hover:text-cyan-400 transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <Instagram className="w-5 h-5 text-slate-400 hover:text-cyan-400 cursor-pointer transition" />
                    <Facebook className="w-5 h-5 text-slate-400 hover:text-cyan-400 cursor-pointer transition" />
                    <Twitter className="w-5 h-5 text-slate-400 hover:text-cyan-400 cursor-pointer transition" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Newsletter</h3>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
                <p>&copy; 2024 Bohat Imported Clothes. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
