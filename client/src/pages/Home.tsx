import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, Menu, X, Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
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

  const products = [
    {
      id: 1,
      name: 'Premium Denim Jacket',
      price: 2500,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
      category: 'Jackets',
      rating: 5,
    },
    {
      id: 2,
      name: 'Premium Classic T-Shirt',
      price: 800,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'T-Shirts',
      rating: 5,
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
      name: 'Premium Casual Shirt',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=400&h=400&fit=crop',
      category: 'Shirts',
      rating: 4,
    },
    {
      id: 5,
      name: 'Premium Sports Hoodie',
      price: 1500,
      originalPrice: 2200,
      image: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=400&h=400&fit=crop',
      category: 'Hoodies',
      rating: 5,
    },
    {
      id: 6,
      name: 'Premium Formal Blazer',
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
      text: 'Excellent quality and amazing prices! The imported clothes are authentic and stylish.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Fatima Malik',
      rating: 5,
      text: 'Best imported clothing store in the area. Great customer service and fast delivery!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      rating: 5,
      text: 'Highly recommend Bhat Imported Clothes. Quality is unmatched at these prices!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Zara Khan',
      rating: 5,
      text: 'Amazing collection and super fast delivery. Will definitely shop again!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const features = [
    { icon: '👑', title: 'Premium Quality', desc: 'Authentic imported clothing' },
    { icon: '❤️', title: 'Hypoallergenic', desc: 'Safe for all skin types' },
    { icon: '💧', title: 'Durable', desc: 'Long-lasting fabric' },
    { icon: '🛡️', title: 'Guaranteed', desc: 'Quality assured products' },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-center py-2 text-sm font-semibold shadow-lg">
        🎉 GET FREE SHIPPING ABOVE ₹999
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-purple-50 to-pink-50 border-b-4 border-pink-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent flex-1 text-center md:flex-none"
            >
              BHAT IMPORTED CLOTHES
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
                <Search size={20} className="text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block">
                <User size={20} className="text-gray-700" />
              </button>
              <button
                onClick={() => setShowCart(!showCart)}
                className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              >
                <ShoppingBag size={20} className="text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8 mt-4 pt-4 border-t">
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ color: '#ec4899' }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`font-medium transition ${
                  activeSection === item.toLowerCase() ? 'text-pink-500' : 'text-gray-700'
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
                className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t"
              >
                {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left font-medium text-gray-700 hover:text-pink-500 transition"
                  >
                    {item}
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 py-12 md:py-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                PREMIUM IMPORTED <span className="text-pink-500">FASHION</span>
              </h1>
              <p className="text-xl text-gray-700 mb-2">Singhpora Pattan, J&K</p>
              <p className="text-gray-600 mb-6">Best Quality | Affordable Price | Unbeatable Selection</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Shop Now
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden"
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

      {/* Features */}
      <section className="py-12 bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Collection - Circular Cards */}
      <section className="py-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">SHOP BY</span> <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">COLLECTION</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden group cursor-pointer mb-4 shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold text-lg">View</span>
                  </div>
                </div>
                <h3 className="text-gray-900 font-semibold text-center text-lg">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            EXPLORE <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">NEW ARRIVALS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={20}
                      fill={favorites.includes(product.id) ? 'currentColor' : 'none'}
                      color={favorites.includes(product.id) ? '#ec4899' : '#d1d5db'}
                    />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-pink-500">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through ml-2 text-sm">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex gap-1">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600 transition"
            >
              VIEW ALL <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our customers <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">love us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            FREQUENTLY ASKED <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">QUESTIONS</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Do you ship all over India?', a: 'Yes, we ship all over India with free shipping above ₹999.' },
              { q: 'How long does delivery take?', a: 'Delivery typically takes 5-7 business days depending on location.' },
              { q: 'How can we contact you?', a: 'You can reach us via WhatsApp, phone, or email. Check our contact page for details.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-700 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            GET IN <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">TOUCH</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:9103174217"
              className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
            >
              <Phone className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
              <p className="text-pink-500 font-bold">9103174217</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://wa.me/8899507736"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
            >
              <Phone className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-pink-500 font-bold">8899507736</p>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="mailto:saqiblateef123456@gmail.com"
              className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition"
            >
              <Mail className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-pink-500 font-bold text-sm">saqiblateef123456@gmail.com</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-12 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-pink-500">BHAT IMPORTED CLOTHES</h3>
              <p className="text-gray-400 text-sm">Premium imported clothing with best quality and affordable prices.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-pink-500 transition">Home</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">Shop</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">About</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-pink-500 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">Returns</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-pink-500 transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/bhat_imported_clothess" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 BHAT IMPORTED CLOTHES. All rights reserved. | Singhpora Pattan, J&K</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-gradient-to-b from-white via-purple-50 to-pink-50 border-l-4 border-purple-400 z-50 overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-pink-500 font-bold">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Proceed to Checkout
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
