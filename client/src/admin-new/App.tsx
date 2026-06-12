import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import { seedDemoProducts } from './lib/storage';

export default function App() {
  useEffect(() => {
    seedDemoProducts();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/admin/products/:id" element={<ProductDetail />} />
        <Route path="/admin/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
