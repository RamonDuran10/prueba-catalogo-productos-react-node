import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
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
      const response = await productService.getAll();
      setProducts(response.data.data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.delete(id);
        fetchProducts(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar producto');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Lista de Productos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image_url} 
              alt={product.title}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
              }}
            />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="category">{product.category_name}</p>
              <p className="price">${product.price}</p>
              <p className="description">{product.description}</p>
              <div className="product-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => {/* TODO: Implementar editar */}}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
