import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Plus, Minus, Instagram, Phone, Mail, Heart, X, Settings, LogOut, User, Package, Lock, Eye, EyeOff, BarChart3, Trash2, Edit2, Save, AlertCircle, Search, Filter, CheckCircle, Upload, TrendingUp, Percent, AlertTriangle, Star, Share2, MapPin, Clock, Zap, Menu } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stock: number;
}

interface Sale {
  id: number;
  title: string;
  description: string;
  discountPercentage?: number;
  imageUrl: string;
  isActive: boolean;
}

interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: Date;
  customerEmail: string;
  customerName: string;
  emailSent?: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  product: string;
}

interface EmailNotification {
  id: number;
  orderId: number;
  email: string;
  subject: string;
  message: string;
  sentAt: Date;
  type: 'order_confirmation' | 'status_update';
}

interface DiscountCode {
  id: number;
  code: string;
  discountPercentage: number;
  maxUses: number;
  usedCount: number;
  expiryDate: Date;
  isActive: boolean;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  topProduct: Product | null;
  categoryBreakdown: { category: string; count: number }[];
}

interface Review {
  id: number;
  productId: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  text: string;
  verified: boolean;
  date: Date;
}

interface WishlistItem {
  productId: number;
  addedDate: Date;
  sharedWith?: string[];
}

const optimizeImage = (imageUrl: string, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > 1200) {
        height = (height * 1200) / width;
        width = 1200;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = imageUrl;
  });
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [websiteSettings, setWebsiteSettings] = useState({
    websiteName: 'BHAT IMPORTED CLOTHES',
    heroTitle: 'BHAT IMPORTED FASHION',
    heroSubtitle: 'Singhpora Pattan, J&K',
    heroDescription: 'Best Quality | Affordable Price | Unbeatable Selection',
    phone: '9103174217',
    whatsapp: '8899507736',
    email: 'saqiblateef123456@gmail.com',
    location: 'Singhpora Pattan, Near J&K Bank',
    hours: 'Open Daily: 9:AM - 10:PM',
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Bhat Denim Jacket',
      description: 'High-quality imported denim jacket with perfect fit and durability.',
      price: 2500,
      originalPrice: 3500,
      category: 'Jackets',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
      stock: 12,
    },
    {
      id: 2,
      name: 'Bhat Classic T-Shirt',
      description: 'Comfortable and stylish imported t-shirt for everyday wear.',
      price: 800,
      originalPrice: 1200,
      category: 'T-Shirts',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      stock: 25,
    },
    {
      id: 3,
      name: 'Bhat Slim Fit Jeans',
      description: 'Premium imported jeans with perfect comfort and style.',
      price: 1800,
      originalPrice: 2500,
      category: 'Jeans',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
      stock: 18,
    },
    {
      id: 4,
      name: 'Bhat Casual Shirt',
      description: 'Versatile imported casual shirt perfect for any occasion.',
      price: 1200,
      category: 'Shirts',
      imageUrl: 'https://images.unsplash.com/photo-1596399514826-b22adfc7405b?w=500&h=500&fit=crop',
      stock: 20,
    },
    {
      id: 5,
      name: 'Bhat Sports Hoodie',
      description: 'Comfortable imported hoodie for sports and casual wear.',
      price: 1500,
      originalPrice: 2200,
      category: 'Hoodies',
      imageUrl: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=500&h=500&fit=crop',
      stock: 15,
    },
    {
      id: 6,
      name: 'Bhat Formal Blazer',
      description: 'Sophisticated imported blazer for professional occasions.',
      price: 3500,
      category: 'Blazers',
      imageUrl: 'https://images.unsplash.com/photo-1591047990635-eea47cdc2e5e?w=500&h=500&fit=crop',
      stock: 8,
    },
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      title: 'Bhat Summer Flash Sale',
      description: 'Up to 40% off on selected imported items',
      discountPercentage: 40,
      imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=300&fit=crop',
      isActive: true,
    },
    {
      id: 2,
      title: 'Bhat New Arrivals',
      description: 'Latest imported collection - 25% off',
      discountPercentage: 25,
      imageUrl: 'https://images.unsplash.com/photo-1556821552-5f0d2c5f3e6f?w=500&h=300&fit=crop',
      isActive: true,
    },
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'Ahmed Khan',
      rating: 5,
      text: 'Excellent quality and amazing prices! The imported clothes are authentic and stylish.',
      product: 'Bhat Denim Jacket',
    },
    {
      id: 2,
      name: 'Fatima Malik',
      rating: 5,
      text: 'Best imported clothing store in the area. Great customer service and fast delivery!',
      product: 'Bhat Slim Fit Jeans',
    },
    {
      id: 3,
      name: 'Hassan Ahmed',
      rating: 5,
      text: 'Highly recommend Bhat Imported Clothes. Quality is unmatched at these prices!',
      product: 'Bhat Classic T-Shirt',
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    {
      id: 1,
      code: 'WELCOME15',
      discountPercentage: 15,
      maxUses: 100,
      usedCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 2,
      code: 'BHAT30',
      discountPercentage: 30,
      maxUses: 50,
      usedCount: 5,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ]);

  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountCode, setDiscountCode] = useState('');

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 1,
      customerName: 'Ahmed Khan',
      customerEmail: 'ahmed@example.com',
      rating: 5,
      title: 'Perfect quality!',
      text: 'The denim jacket is exactly as described. Great quality and perfect fit.',
      verified: true,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'Jackets', imageUrl: '', stock: 0 });
  const [newSale, setNewSale] = useState({ title: '', description: '', discountPercentage: 0, imageUrl: '', isActive: true });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [saleImagePreview, setSaleImagePreview] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const analytics: Analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const productSales: { [key: number]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
      });
    });
    
    const topProductId = Object.entries(productSales).sort(([, a], [, b]) => b - a)[0]?.[0];
    const topProduct = topProductId ? products.find(p => p.id === Number(topProductId)) || null : null;
    
    const categoryBreakdown = categories
      .filter(c => c !== 'All')
      .map(category => ({
        category,
        count: products.filter(p => p.category === category).length,
      }));
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers: uniqueCustomers,
      averageOrderValue,
      topProduct,
      categoryBreakdown,
    };
  }, [orders, products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, quantity: 1, product }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const toggleFavorite = (productId: number) => {
    setFavorites(favorites.includes(productId) ? favorites.filter(id => id !== productId) : [...favorites, productId]);
  };

  const handleImageUpload = async (file: File, isProduct: boolean = true) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      setIsOptimizing(true);
      try {
        const optimizedImage = await optimizeImage(imageUrl, 0.85);
        if (isProduct) {
          setProductImagePreview(optimizedImage);
          setNewProduct({ ...newProduct, imageUrl: optimizedImage });
        } else {
          setSaleImagePreview(optimizedImage);
          setNewSale({ ...newSale, imageUrl: optimizedImage });
        }
      } catch (error) {
        console.error('Image optimization failed:', error);
      } finally {
        setIsOptimizing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      setProducts([...products, { ...newProduct, id: Math.max(...products.map(p => p.id), 0) + 1, stock: newProduct.stock }]);
      setNewProduct({ name: '', description: '', price: 0, category: 'Jackets', imageUrl: '', stock: 0 });
      setProductImagePreview(null);
    }
  };

  const handleAddSale = () => {
    if (newSale.title && newSale.discountPercentage > 0) {
      setSales([...sales, { ...newSale, id: Math.max(...sales.map(s => s.id), 0) + 1 }]);
      setNewSale({ title: '', description: '', discountPercentage: 0, imageUrl: '', isActive: true });
      setSaleImagePreview(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleDeleteSale = (id: number) => {
    setSales(sales.filter(s => s.id !== id));
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setShowMobileMenu(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 text-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300/15 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b-2 border-gradient-to-r from-pink-300 via-purple-300 to-blue-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            BIH
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['home', 'collection', 'about', 'contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item)}
                className={`font-semibold capitalize text-lg transition-all duration-300 ${
                  activeSection === item
                    ? 'text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 rounded-lg transition duration-300"
            >
              <ShoppingBag size={24} className="text-purple-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="p-2 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 rounded-lg transition duration-300"
            >
              <Settings size={24} className="text-purple-600" />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 rounded-lg transition duration-300"
            >
              <Menu size={24} className="text-purple-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-gradient-to-b from-white to-blue-50 border-t-2 border-purple-300"
            >
              <div className="flex flex-col gap-4 p-4">
                {['home', 'collection', 'about', 'contact'].map((item) => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => scrollToSection(item)}
                    className={`font-semibold capitalize text-lg transition-all duration-300 ${
                      activeSection === item
                        ? 'text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text'
                        : 'text-gray-700 hover:text-purple-600'
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Home Section */}
      <section id="home" className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {websiteSettings.heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold mb-2">{websiteSettings.heroSubtitle}</p>
            <p className="text-lg text-gray-600">{websiteSettings.heroDescription}</p>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-gradient-to-br from-pink-100 to-rose-50 border-2 border-pink-300 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
            >
              <Clock className="w-8 h-8 text-pink-600 mb-3" />
              <p className="text-sm text-gray-700 font-semibold">{websiteSettings.hours}</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 to-indigo-50 border-2 border-purple-300 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
            >
              <MapPin className="w-8 h-8 text-purple-600 mb-3" />
              <p className="text-sm text-gray-700 font-semibold">{websiteSettings.location}</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-gradient-to-br from-blue-100 to-cyan-50 border-2 border-blue-300 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
            >
              <Zap className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-sm text-gray-700 font-semibold">Best Quality | Affordable Price</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
            Our Collection
          </h2>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-purple-500" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-purple-300 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 transition shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition duration-300 ${
                  (category === 'All' && selectedCategory === null) || selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-purple-300 hover:border-pink-500'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Products Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => {
                  setSelectedProduct(product);
                  setShowProductModal(true);
                }}
                className="group cursor-pointer"
              >
                <div className="bg-white border-2 border-purple-200 rounded-2xl overflow-hidden hover:border-pink-400 transition duration-300 shadow-lg hover:shadow-2xl">
                  <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="p-2 hover:bg-pink-100 rounded-lg transition"
                      >
                        <Heart
                          size={20}
                          fill={favorites.includes(product.id) ? 'currentColor' : 'none'}
                          color={favorites.includes(product.id) ? '#ec4899' : '#d1d5db'}
                        />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag size={18} /> Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 py-20 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
            About Bhat Imported Clothes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white border-2 border-purple-300 rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Our Story</h3>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Bhat Imported Clothes is your one-stop destination for premium imported fashion at affordable prices. Located in Singhpora Pattan near J&K Bank, we bring you the best quality clothing from around the world.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                With years of experience in the fashion industry, we pride ourselves on offering authentic, high-quality imported garments that combine style, comfort, and durability. Our mission is to make premium fashion accessible to everyone.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white border-2 border-purple-300 rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  'Authentic Imported Products',
                  'Best Quality Guaranteed',
                  'Affordable Prices',
                  'Expert Customer Service',
                  'Wide Selection',
                  'Fast Delivery'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700 text-lg"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Testimonials */}
          <div className="mt-16">
            <h3 className="text-4xl font-black mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
              Customer Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white border-2 border-purple-300 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#ec4899" color="#ec4899" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                  <div className="border-t-2 border-purple-200 pt-4">
                    <p className="font-semibold text-purple-600">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.product}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
            Get in Touch
          </h2>
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-2 border-purple-300 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`tel:${websiteSettings.phone}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition border-2 border-pink-300"
              >
                <Phone className="w-8 h-8 text-pink-600" />
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Call Us</p>
                  <p className="font-bold text-pink-600">{websiteSettings.phone}</p>
                </div>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`https://wa.me/${websiteSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition border-2 border-purple-300"
              >
                <Phone className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-gray-600 text-sm font-semibold">WhatsApp</p>
                  <p className="font-bold text-purple-600">{websiteSettings.whatsapp}</p>
                </div>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`mailto:${websiteSettings.email}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition border-2 border-blue-300"
              >
                <Mail className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Email</p>
                  <p className="font-bold text-blue-600 text-sm">{websiteSettings.email}</p>
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white border-l-2 border-purple-300 z-50 overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Shopping Cart</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-purple-100 rounded-lg transition">
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      return product ? (
                        <div key={item.productId} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                          <div className="flex gap-4 mb-3">
                            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded object-cover" />
                            <div className="flex-1">
                              <p className="font-semibold text-purple-600">{product.name}</p>
                              <p className="text-gray-600 text-sm">₹{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                className="p-1 hover:bg-purple-200 rounded"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-6 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                className="p-1 hover:bg-purple-200 rounded"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="p-1 hover:bg-red-200 rounded text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="border-t-2 border-purple-200 pt-4 mb-6">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-700 font-semibold">Subtotal:</span>
                      <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition duration-300 shadow-lg"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProductModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden border-2 border-purple-300 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                <div className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl h-96">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{selectedProduct.name}</h2>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    <div className="flex gap-3 items-center mb-6">
                      <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">₹{selectedProduct.price.toLocaleString()}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6 font-semibold">Stock: {selectedProduct.stock} available</p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        addToCart(selectedProduct);
                        setShowProductModal(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag size={20} /> Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-lg transition border-2 border-pink-300"
                    >
                      <Heart
                        size={20}
                        fill={favorites.includes(selectedProduct.id) ? 'currentColor' : 'none'}
                        color={favorites.includes(selectedProduct.id) ? '#ec4899' : '#9ca3af'}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto p-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-8 border-2 border-purple-300 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Admin Panel</h2>
                  <button onClick={() => setShowAdminPanel(false)} className="p-2 hover:bg-purple-100 rounded-lg transition">
                    <X size={24} />
                  </button>
                </div>

                {/* Add Product */}
                <div className="mb-8 pb-8 border-b-2 border-purple-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
                    <Plus size={20} /> Add New Product
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500"
                    />
                    <textarea
                      placeholder="Product Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 h-20 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-pink-500"
                    >
                      <option value="Jackets">Jackets</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Jeans">Jeans</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Blazers">Blazers</option>
                    </select>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-purple-600">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, true);
                        }}
                        disabled={isOptimizing}
                        className="w-full bg-white border-2 border-purple-300 rounded px-3 py-2 text-gray-900 text-sm file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:cursor-pointer disabled:opacity-50"
                      />
                      {isOptimizing && <p className="text-sm text-purple-600 mt-2">Optimizing image...</p>}
                      {productImagePreview && (
                        <div className="mt-2 relative h-24 bg-purple-100 rounded border-2 border-purple-300 overflow-hidden">
                          <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddProduct}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded font-semibold hover:from-pink-600 hover:to-purple-700 transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Plus size={18} /> Add Product
                    </motion.button>
                  </div>
                </div>

                {/* Manage Products */}
                <div className="mb-8 pb-8 border-b-2 border-purple-200">
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">Products ({products.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {products.map(product => (
                      <div key={product.id} className="bg-purple-50 border-2 border-purple-200 p-3 rounded flex justify-between items-center hover:bg-purple-100 transition">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-purple-600">{product.name}</p>
                          <p className="text-xs text-gray-600">₹{product.price.toLocaleString()} • Stock: {product.stock}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-200 rounded transition text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-t-2 border-purple-300 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">About Bhat Imported Clothes</h3>
            <p className="text-gray-700 text-sm">Premium imported clothing with best quality and affordable prices. Located in Singhpora Pattan near J&K Bank.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Categories</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">Jackets</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">T-Shirts</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">Jeans</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">Hoodies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="#contact" className="hover:text-purple-600 transition font-semibold">Contact</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">FAQ</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">Shipping</a></li>
              <li><a href="#" className="hover:text-purple-600 transition font-semibold">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/bhat_imported_clothess" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition"><Instagram size={20} /></a>
              <a href={`tel:${websiteSettings.phone}`} className="hover:text-purple-600 transition"><Phone size={20} /></a>
              <a href={`mailto:${websiteSettings.email}`} className="hover:text-purple-600 transition"><Mail size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-purple-300 pt-8 text-center text-gray-700 text-sm">
          <p>&copy; 2026 Bhat Imported Clothes. All rights reserved. Best Quality | Affordable Price ❤️ Singhpora Pattan, J&K</p>
        </div>
      </footer>
    </div>
  );
}
