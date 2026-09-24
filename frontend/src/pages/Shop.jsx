import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Products could not be loaded. Please try again.');
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setError('Unable to load products. Check that the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((product) => product.category))];
  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => category === 'All' || product.category === category)
    .sort((firstProduct, secondProduct) => {
      if (sortBy === 'price-low') return firstProduct.price - secondProduct.price;
      if (sortBy === 'price-high') return secondProduct.price - firstProduct.price;
      if (sortBy === 'rating') return secondProduct.ratings - firstProduct.ratings;
      return 0;
    });

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <div className="shop-toolbar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select" aria-label="Filter by category">
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      {loading ? (
        <p className="status-message">Loading products...</p>
      ) : error ? (
        <p className="status-message error-message">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="status-message">No products match your search or selected category.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
