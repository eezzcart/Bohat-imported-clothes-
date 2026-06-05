import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Plus, Minus, Instagram, Twitter, Linkedin, Heart, X, Settings, LogOut, User, Package, Lock, Eye, EyeOff, BarChart3, Trash2, Edit2, Save, AlertCircle, Search, Filter, Mail, CheckCircle, Upload, TrendingUp, Percent, AlertTriangle, Star, Share2, MessageCircle } from 'lucide-react';

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

// Image optimization function
const optimizeImage = (imageUrl: string, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if larger than 1200px
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
  // UI State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [emailNotificationMessage, setEmailNotificationMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // User & Auth
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // Data State
  const [websiteSettings, setWebsiteSettings] = useState({
    websiteName: 'BHAT IMPORTED CLOTHES',
    heroTitle: 'BEST QUALITY | AFFORDABLE PRICE',
    heroSubtitle: 'Singhpora Pattan, J&K — Near J&K Bank',
    heroDescription: 'PREMIUM IMPORTED CLOTHING WITH UNBEATABLE PRICES. OPEN DAILY 9:AM TO 10:PM',
    backgroundVideoUrl: '/manus-storage/70bdf080-3cd6-11f1-b4d6-6d9b715d3621_50da3163.mp4',
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Embroidered Suit',
      description: 'Traditional embroidered suit with modern cut. Features intricate Aari work with contemporary silhouette.',
      price: 15000,
      originalPrice: 20000,
      category: 'Suits',
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
      stock: 5,
    },
    {
      id: 2,
      name: 'Bridal Lehenga',
      description: 'Stunning bridal lehenga with intricate details. Perfect for your special day with luxurious fabrics.',
      price: 50000,
      category: 'Bridals',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      stock: 3,
    },
    {
      id: 3,
      name: 'Black Abaya',
      description: 'Elegant black abaya with gold embroidery. Timeless elegance meets modern comfort.',
      price: 8000,
      category: 'Abayas',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
      stock: 10,
    },
    {
      id: 4,
      name: 'Kashmiri Saree',
      description: 'Traditional Kashmiri saree with hand-embroidered patterns. A timeless classic.',
      price: 12000,
      originalPrice: 16000,
      category: 'Sarees',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
      stock: 7,
    },
    {
      id: 5,
      name: 'Silk Dupatta',
      description: 'Luxurious silk dupatta with traditional embroidery. Perfect accessory for any outfit.',
      price: 3500,
      originalPrice: 5000,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      stock: 15,
    },
    {
      id: 6,
      name: 'Formal Suit',
      description: 'Sophisticated formal suit with subtle embroidery details. Perfect for special occasions.',
      price: 18000,
      category: 'Suits',
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
      stock: 4,
    },
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      title: 'Anniversary Sale',
      description: 'Celebrate with us - 30% off on all bridals',
      discountPercentage: 30,
      imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=300&fit=crop',
      isActive: true,
    },
    {
      id: 2,
      title: 'Summer Collection',
      description: 'Fresh designs for the season - 20% off',
      discountPercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=300&fit=crop',
      isActive: true,
    },
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'Fatima Khan',
      rating: 5,
      text: 'The embroidered suit was absolutely stunning! The craftsmanship is impeccable and the fit is perfect.',
      product: 'Embroidered Suit',
    },
    {
      id: 2,
      name: 'Aisha Malik',
      rating: 5,
      text: 'My bridal lehenga exceeded all my expectations. The quality and design are simply magnificent.',
      product: 'Bridal Lehenga',
    },
    {
      id: 3,
      name: 'Zainab Ahmed',
      rating: 5,
      text: 'The abaya is elegant and comfortable. I receive compliments every time I wear it.',
      product: 'Black Abaya',
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);

  // Discount Codes State
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    {
      id: 1,
      code: 'WELCOME10',
      discountPercentage: 10,
      maxUses: 100,
      usedCount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: 2,
      code: 'SUMMER20',
      discountPercentage: 20,
      maxUses: 50,
      usedCount: 5,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [newDiscountCode, setNewDiscountCode] = useState({ code: '', discountPercentage: 0, maxUses: 100 });
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      productId: 1,
      customerName: 'Fatima Khan',
      customerEmail: 'fatima@example.com',
      rating: 5,
      title: 'Absolutely stunning!',
      text: 'The embroidered suit exceeded my expectations. The craftsmanship is impeccable.',
      verified: true,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({ title: '', text: '', rating: 5 });

  // Wishlist State
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [showWishlistShare, setShowWishlistShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  // Admin Form States
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'Suits', imageUrl: '', stock: 0 });
  const [newSale, setNewSale] = useState({ title: '', description: '', discountPercentage: 0, imageUrl: '', isActive: true });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [saleImagePreview, setSaleImagePreview] = useState<string | null>(null);
  const [bulkUploadFiles, setBulkUploadFiles] = useState<File[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Calculate Analytics
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

  // Get low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= lowStockThreshold);
  }, [products, lowStockThreshold]);

  // Filtered products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Send Email Notification
  const sendEmailNotification = (order: Order, type: 'order_confirmation' | 'status_update') => {
    const subject = type === 'order_confirmation' 
      ? `Order Confirmation - Order #${order.id}`
      : `Order Update - Order #${order.id}`;
    
    const message = type === 'order_confirmation'
      ? `Thank you for your order! Your order #${order.id} has been confirmed. Total: ₹${order.total.toLocaleString()}`
      : `Your order #${order.id} status has been updated to: ${order.status}`;

    const notification: EmailNotification = {
      id: Math.random(),
      orderId: order.id,
      email: order.customerEmail,
      subject,
      message,
      sentAt: new Date(),
      type,
    };

    setEmailNotifications([...emailNotifications, notification]);
    setEmailNotificationMessage(`Email sent to ${order.customerEmail}`);
    setShowEmailNotification(true);
    setTimeout(() => setShowEmailNotification(false), 3000);
  };

  // Handle image upload with optimization
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
        if (isProduct) {
          setProductImagePreview(imageUrl);
          setNewProduct({ ...newProduct, imageUrl });
        } else {
          setSaleImagePreview(imageUrl);
          setNewSale({ ...newSale, imageUrl });
        }
      }
      setIsOptimizing(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle bulk image upload
  const handleBulkImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setBulkUploadFiles(fileArray);
    setEmailNotificationMessage(`${fileArray.length} images ready for bulk upload`);
    setShowEmailNotification(true);
    setTimeout(() => setShowEmailNotification(false), 3000);
  };

  // Admin Login Handler
  const handleAdminLogin = () => {
    setAdminLoginError('');
    
    if (adminEmail === 'admin@example.com' && adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminEmail('');
      setAdminPassword('');
    } else {
      setAdminLoginError('Invalid email or password');
    }
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  // Authentication Functions
  const handleLogin = () => {
    if (authEmail && authName) {
      setUser({
        id: Math.random(),
        email: authEmail,
        name: authName,
        isLoggedIn: true,
      });
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthName('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setShowOrdersPanel(false);
  };

  // Apply Discount Code
  const handleApplyDiscount = () => {
    const code = discountCodes.find(c => c.code.toUpperCase() === discountCode.toUpperCase() && c.isActive);
    if (code && code.usedCount < code.maxUses) {
      setAppliedDiscount(code);
      setEmailNotificationMessage(`Discount code applied! ${code.discountPercentage}% off`);
      setShowEmailNotification(true);
      setTimeout(() => setShowEmailNotification(false), 3000);
    } else {
      setEmailNotificationMessage('Invalid or expired discount code');
      setShowEmailNotification(true);
      setTimeout(() => setShowEmailNotification(false), 3000);
    }
  };

  // Add Discount Code (Admin)
  const handleAddDiscountCode = () => {
    if (newDiscountCode.code && newDiscountCode.discountPercentage > 0) {
      const code: DiscountCode = {
        id: Math.max(...discountCodes.map(c => c.id), 0) + 1,
        code: newDiscountCode.code.toUpperCase(),
        discountPercentage: newDiscountCode.discountPercentage,
        maxUses: newDiscountCode.maxUses,
        usedCount: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      };
      setDiscountCodes([...discountCodes, code]);
      setNewDiscountCode({ code: '', discountPercentage: 0, maxUses: 100 });
      setEmailNotificationMessage('Discount code created successfully');
      setShowEmailNotification(true);
      setTimeout(() => setShowEmailNotification(false), 3000);
    }
  };


  // Add Review
  const handleAddReview = () => {
    if (selectedProductForReview && newReview.title && newReview.text && user) {
      const review: Review = {
        id: Math.max(...reviews.map(r => r.id), 0) + 1,
        productId: selectedProductForReview,
        customerName: user.name,
        customerEmail: user.email,
        rating: newReview.rating,
        title: newReview.title,
        text: newReview.text,
        verified: true,
        date: new Date(),
      };
      setReviews([...reviews, review]);
      setShowReviewModal(false);
      setSelectedProductForReview(null);
      setNewReview({ title: '', text: '', rating: 5 });
      setEmailNotificationMessage('Review submitted successfully!');
      setShowEmailNotification(true);
      setTimeout(() => setShowEmailNotification(false), 3000);
    }
  };

  // Add to Wishlist
  const toggleWishlistItem = (productId: number) => {
    const exists = wishlist.find(item => item.productId === productId);
    if (exists) {
      setWishlist(wishlist.filter(item => item.productId !== productId));
    } else {
      setWishlist([...wishlist, { productId, addedDate: new Date() }]);
    }
  };

  // Share Wishlist
  const handleShareWishlist = () => {
    if (shareEmail && wishlist.length > 0) {
      const wishlistProducts = wishlist.map(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.name || '';
      }).filter(Boolean);
      
      const message = `Check out my wishlist: ${wishlistProducts.join(', ')}`;
      setEmailNotificationMessage(`Wishlist shared with ${shareEmail}!`);
      setShowEmailNotification(true);
      setTimeout(() => setShowEmailNotification(false), 3000);
      setShareEmail('');
    }
  };

  // Get product reviews
  const getProductReviews = (productId: number) => {
    return reviews.filter(r => r.productId === productId);
  };

  // Get average rating
  const getAverageRating = (productId: number) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

    // Checkout Function
  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (cart.length === 0) return;

    let finalTotal = cartTotal;
    if (appliedDiscount) {
      finalTotal = cartTotal * (1 - appliedDiscount.discountPercentage / 100);
      setDiscountCodes(discountCodes.map(c => 
        c.id === appliedDiscount.id ? { ...c, usedCount: c.usedCount + 1 } : c
      ));
    }

    const newOrder: Order = {
      id: Math.max(...orders.map(o => o.id), 0) + 1,
      items: [...cart],
      total: finalTotal,
      status: 'pending',
      date: new Date(),
      customerEmail: user.email,
      customerName: user.name,
      emailSent: false,
    };

    setOrders([...orders, newOrder]);
    sendEmailNotification(newOrder, 'order_confirmation');
    setCart([]);
    setAppliedDiscount(null);
    setDiscountCode('');
    setShowCart(false);
    alert('Order placed successfully! Your order ID: #' + newOrder.id + '\nConfirmation email sent to ' + user.email);
  };

  // Admin Functions
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const product: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...newProduct,
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', description: '', price: 0, category: 'Suits', imageUrl: '', stock: 0 });
      setProductImagePreview(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setProductImagePreview(product.imageUrl);
    setShowEditModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct && newProduct.name && newProduct.price > 0) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
      setEditingProduct(null);
      setShowEditModal(false);
      setNewProduct({ name: '', description: '', price: 0, category: 'Suits', imageUrl: '', stock: 0 });
      setProductImagePreview(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddSale = () => {
    if (newSale.title) {
      const sale: Sale = {
        id: Math.max(...sales.map(s => s.id), 0) + 1,
        ...newSale,
      };
      setSales([...sales, sale]);
      setNewSale({ title: '', description: '', discountPercentage: 0, imageUrl: '', isActive: true });
      setSaleImagePreview(null);
    }
  };

  const handleDeleteSale = (id: number) => {
    setSales(sales.filter(s => s.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        sendEmailNotification(updatedOrder, 'status_update');
        return updatedOrder;
      }
      return order;
    }));
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
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
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Favorites Functions
  const toggleFavorite = (productId: number) => {
    setFavorites(favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    );
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const discountedTotal = appliedDiscount 
    ? cartTotal * (1 - appliedDiscount.discountPercentage / 100)
    : cartTotal;

  const discountAmount = cartTotal - discountedTotal;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Email Notification Toast */}
      <AnimatePresence>
        {showEmailNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-500/50 rounded-lg px-6 py-3 flex items-center gap-3 backdrop-blur"
          >
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-300">{emailNotificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-widest">{websiteSettings.websiteName}</div>
          <div className="flex gap-6 items-center">
            {user && (
              <button onClick={() => setShowOrdersPanel(!showOrdersPanel)} className="hover:text-gray-300 transition flex items-center gap-2">
                <Package size={20} />
                <span className="text-sm">{orders.length}</span>
              </button>
            )}
            <button onClick={() => setShowCart(!showCart)} className="relative hover:text-gray-300 transition">
              <ShoppingBag size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            {user && (
              <div className="flex gap-2 items-center">
                <span className="text-sm">{user.name}</span>
                <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded transition">
                  <LogOut size={20} />
                </button>
              </div>
            )}
            <button 
              onClick={() => {
                if (isAdmin) {
                  setShowAdminPanel(!showAdminPanel);
                } else {
                  setShowAdminLogin(true);
                }
              }}
              className="p-2 hover:bg-white/10 rounded transition"
              title={isAdmin ? "Admin Panel" : "Admin Login"}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
          src={websiteSettings.backgroundVideoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-300 text-sm mb-4 tracking-widest">{websiteSettings.heroSubtitle}</p>
            <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
              {websiteSettings.heroTitle}
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">{websiteSettings.heroDescription}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition inline-flex items-center gap-2"
            >
              Explore Collection <ArrowUpRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Featured Collections</h2>
            <p className="text-gray-400 text-lg">Discover our curated selections of traditional and contemporary designs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Suits', 'Bridals', 'Abayas'].map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-semibold">Explore {category}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{category}</h3>
                <p className="text-gray-400 text-sm mt-2">{products.filter(p => p.category === category).length} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Banner */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sales.map((sale, idx) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img src={sale.imageUrl} alt={sale.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-2">{sale.title}</h3>
                    <p className="text-gray-200 mb-4">{sale.description}</p>
                    {sale.discountPercentage && (
                      <span className="text-4xl font-bold text-yellow-400">{sale.discountPercentage}% OFF</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section with Search and Filter */}
      <section id="products" className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our Collection</h2>
            <p className="text-gray-400 text-lg">Handcrafted elegance with traditional Aari work</p>
          </motion.div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition flex items-center gap-2"
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Category Filter */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                      className={`px-4 py-2 rounded-lg transition ${
                        (selectedCategory === null && category === 'All') || selectedCategory === category
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/10 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mb-6 text-gray-400 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden mb-4">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition backdrop-blur"
                      >
                        <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} color={favorites.includes(product.id) ? 'red' : 'white'} />
                      </button>
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded text-sm font-semibold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-300 transition">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Reviews</h2>
            <p className="text-gray-400 text-lg">What our customers say about LYKA</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.product}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>About LYKA</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Since 2014, LYKA has been crafting elegant attire in the heart of Bandipora, Jammu & Kashmir. 
              We blend traditional Aari embroidery work with modern silhouettes to create pieces that celebrate 
              contemporary femininity while honoring our rich cultural heritage.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Each piece is meticulously designed and handcrafted by skilled artisans, ensuring that every 
              garment tells a story of tradition, quality, and timeless elegance. We are committed to sustainable 
              practices and fair trade, supporting local communities and preserving traditional craftsmanship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && !isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdminLogin(false)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-md w-full p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock size={28} className="text-white" />
                <h2 className="text-3xl font-bold">Admin Login</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {adminLoginError && (
                  <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded px-4 py-3 text-red-300">
                    <AlertCircle size={18} />
                    <span className="text-sm">{adminLoginError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-md w-full p-8 border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-6">Login</h2>
              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Panel */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-white/10 overflow-y-auto z-40"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button onClick={() => setShowCart(false)} className="hover:bg-white/10 p-2 rounded">
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={item.productId} className="bg-white/5 p-4 rounded">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">{product?.name}</p>
                              <p className="text-gray-400 text-sm">₹{product?.price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="p-1 hover:bg-red-500/20 rounded transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="flex-1 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    {/* Discount Code Section */}
                    <div className="mb-4 bg-white/5 p-3 rounded">
                      <label className="block text-sm font-semibold mb-2">Discount Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 text-sm"
                        />
                        <button
                          onClick={handleApplyDiscount}
                          className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-sm font-semibold transition"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedDiscount && (
                        <div className="mt-2 text-green-400 text-sm">
                          ✓ {appliedDiscount.code}: {appliedDiscount.discountPercentage}% off
                        </div>
                      )}
                    </div>

                    {/* Pricing Summary */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm text-green-400">
                          <span>Discount ({appliedDiscount?.discountPercentage}%):</span>
                          <span>-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-white/10 pt-2">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold">₹{discountedTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      {user ? 'Checkout' : 'Login to Checkout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Panel */}
      <AnimatePresence>
        {showOrdersPanel && user && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-white/10 overflow-y-auto z-40"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <button onClick={() => setShowOrdersPanel(false)} className="hover:bg-white/10 p-2 rounded">
                  <X size={20} />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white/5 p-4 rounded">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-gray-400 text-xs">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="mb-3">
                        {order.items.map(item => {
                          const prod = products.find(p => p.id === item.productId);
                          return (
                            <p key={item.productId} className="text-sm text-gray-400">
                              {prod?.name} x{item.quantity}
                            </p>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold">₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditModal && editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowEditModal(false);
              setEditingProduct(null);
              setNewProduct({ name: '', description: '', price: 0, category: 'Suits', imageUrl: '', stock: 0 });
              setProductImagePreview(null);
            }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-2xl w-full p-8 border border-white/10 my-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Edit2 size={28} className="text-white" />
                <h2 className="text-3xl font-bold">Edit Product</h2>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                />
                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 h-20 resize-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                </div>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="Suits">Suits</option>
                  <option value="Bridals">Bridals</option>
                  <option value="Abayas">Abayas</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, true);
                    }}
                    disabled={isOptimizing}
                    className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-white text-sm file:bg-white/20 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:cursor-pointer disabled:opacity-50"
                  />
                  {isOptimizing && <p className="text-sm text-yellow-400 mt-2">Optimizing image...</p>}
                  {productImagePreview && (
                    <div className="mt-2 relative h-32 bg-white/5 rounded border border-white/10 overflow-hidden">
                      <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setNewProduct({ name: '', description: '', price: 0, category: 'Suits', imageUrl: '', stock: 0 });
                    setProductImagePreview(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-gray-900 border-l border-white/10 overflow-y-auto z-40 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                    <p className="text-gray-400 text-sm">Manage your store</p>
                  </div>
                </div>
                <button onClick={() => handleAdminLogout()} className="p-2 hover:bg-red-500/20 rounded transition" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Active Sales</p>
                  <p className="text-3xl font-bold">{sales.filter(s => s.isActive).length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="w-full flex items-center justify-between mb-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp size={20} /> Analytics Dashboard
                  </h3>
                  <span className="text-sm">{showAnalytics ? '▼' : '▶'}</span>
                </button>
                
                {showAnalytics && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Total Orders</p>
                        <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Total Customers</p>
                        <p className="text-2xl font-bold">{analytics.totalCustomers}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Avg Order Value</p>
                        <p className="text-2xl font-bold">₹{Math.round(analytics.averageOrderValue).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {analytics.topProduct && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-2">Top Selling Product</p>
                        <p className="font-semibold">{analytics.topProduct.name}</p>
                        <p className="text-sm text-gray-400">₹{analytics.topProduct.price.toLocaleString()}</p>
                      </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-2">Products by Category</p>
                      <div className="space-y-1">
                        {analytics.categoryBreakdown.map(cat => (
                          <div key={cat.category} className="flex justify-between text-sm">
                            <span>{cat.category}</span>
                            <span className="font-semibold">{cat.count} items</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Low Stock Alerts */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className={lowStockProducts.length > 0 ? 'text-yellow-400' : 'text-gray-400'} /> 
                  Inventory Alerts
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                </div>
                
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-yellow-400">Stock: {product.stock}</p>
                        </div>
                        <AlertTriangle size={18} className="text-yellow-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">All products have sufficient stock</p>
                )}
              </div>

              {/* Discount Codes Management */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Percent size={20} /> Discount Codes
                </h3>
                
                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Code (e.g., SUMMER20)"
                    value={newDiscountCode.code}
                    onChange={(e) => setNewDiscountCode({ ...newDiscountCode, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={newDiscountCode.discountPercentage}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, discountPercentage: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="number"
                      placeholder="Max Uses"
                      value={newDiscountCode.maxUses}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, maxUses: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <button
                    onClick={handleAddDiscountCode}
                    className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Discount Code
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {discountCodes.map(code => (
                    <div key={code.id} className="bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center hover:bg-white/10 transition">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{code.code}</p>
                        <p className="text-xs text-gray-400">{code.discountPercentage}% off • Used: {code.usedCount}/{code.maxUses}</p>
                      </div>
                      <button
                        onClick={() => setDiscountCodes(discountCodes.filter(c => c.id !== code.id))}
                        className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders Management */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package size={20} /> Manage Orders
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {orders.length === 0 ? (
                    <p className="text-gray-400 text-sm">No orders yet</p>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-white/5 border border-white/10 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm">Order #{order.id}</p>
                            <p className="text-xs text-gray-400">{order.customerName} ({order.customerEmail})</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/40"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <button
                            onClick={() => sendEmailNotification(order, 'status_update')}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs flex items-center gap-1"
                            title="Send status update email"
                          >
                            <Mail size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Website Settings */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings size={20} /> Website Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Website Name</label>
                    <input
                      type="text"
                      value={websiteSettings.websiteName}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, websiteName: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={websiteSettings.heroTitle}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, heroTitle: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Hero Description</label>
                    <textarea
                      value={websiteSettings.heroDescription}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, heroDescription: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Add Product */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus size={20} /> Add New Product
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                  <textarea
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 h-20 resize-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Suits">Suits</option>
                    <option value="Bridals">Bridals</option>
                    <option value="Abayas">Abayas</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, true);
                      }}
                      disabled={isOptimizing}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm file:bg-white/20 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:cursor-pointer disabled:opacity-50"
                    />
                    {isOptimizing && <p className="text-sm text-yellow-400 mt-2">Optimizing image...</p>}
                    {productImagePreview && (
                      <div className="mt-2 relative h-24 bg-white/5 rounded border border-white/10 overflow-hidden">
                        <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Product
                  </button>
                </div>
              </div>

              {/* Bulk Upload */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload size={20} /> Bulk Image Upload
                </h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleBulkImageUpload(e.target.files);
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm file:bg-white/20 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:cursor-pointer"
                  />
                  {bulkUploadFiles.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded p-3">
                      <p className="text-sm font-semibold mb-2">{bulkUploadFiles.length} images selected</p>
                      <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {bulkUploadFiles.map((file, idx) => (
                          <div key={idx} className="relative h-20 bg-white/10 rounded overflow-hidden">
                            <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Manage Products */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4">Products ({products.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {products.map(product => (
                    <div key={product.id} className="bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center hover:bg-white/10 transition">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">₹{product.price.toLocaleString()} • Stock: {product.stock}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-blue-500/20 rounded transition text-blue-400"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Sale */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus size={20} /> Add New Sale
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Sale Title"
                    value={newSale.title}
                    onChange={(e) => setNewSale({ ...newSale, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                  <textarea
                    placeholder="Sale Description"
                    value={newSale.description}
                    onChange={(e) => setNewSale({ ...newSale, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 h-16 resize-none"
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={newSale.discountPercentage}
                    onChange={(e) => setNewSale({ ...newSale, discountPercentage: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  />
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sale Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, false);
                      }}
                      disabled={isOptimizing}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm file:bg-white/20 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:cursor-pointer disabled:opacity-50"
                    />
                    {saleImagePreview && (
                      <div className="mt-2 relative h-24 bg-white/5 rounded border border-white/10 overflow-hidden">
                        <img src={saleImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddSale}
                    className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Sale
                  </button>
                </div>
              </div>

              {/* Manage Sales */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Active Sales ({sales.filter(s => s.isActive).length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sales.map(sale => (
                    <div key={sale.id} className="bg-white/5 border border-white/10 p-3 rounded flex justify-between items-center hover:bg-white/10 transition">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{sale.title}</p>
                        <p className="text-xs text-gray-400">{sale.discountPercentage}% OFF • {sale.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="p-2 hover:bg-red-500/20 rounded transition text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-2xl w-full overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="flex items-center justify-center bg-gray-800 rounded-lg h-96">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                    <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
                    <div className="flex gap-3 items-center mb-6">
                      <span className="text-3xl font-bold">₹{selectedProduct.price.toLocaleString()}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-6">Stock: {selectedProduct.stock} available</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setShowProductModal(false);
                      }}
                      className="flex-1 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={20} /> Add to Cart
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                      <Heart size={20} fill={favorites.includes(selectedProduct.id) ? 'currentColor' : 'none'} color={favorites.includes(selectedProduct.id) ? 'red' : 'white'} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Bhat Imported Clothes</h3>
            <p className="text-gray-400 text-sm">Premium imported clothing with best quality and affordable prices. Located in Singhpora Pattan near J&K Bank. Open daily from 9:AM to 10:PM.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Collections</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Suits</a></li>
              <li><a href="#" className="hover:text-white transition">Bridals</a></li>
              <li><a href="#" className="hover:text-white transition">Abayas</a></li>
              <li><a href="#" className="hover:text-white transition">Sarees</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-gray-300 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-gray-300 transition"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Bhat Imported Clothes. All rights reserved. Best Quality | Affordable Price ❤️ Singhpora Pattan, J&K</p>
        </div>
      </footer>
    </div>
  );
}
