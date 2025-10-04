import React, { useState, useEffect } from 'react';
import { productService } from '../../../services/api';
import ProductCard from './ProductCard';
import '../productos.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Solicitar todos los productos sin límite para el catálogo
      const response = await productService.getAll(1, 1000);
      setProducts(response.data.data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showActions={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
