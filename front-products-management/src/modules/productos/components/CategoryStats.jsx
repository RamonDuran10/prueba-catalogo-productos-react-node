import React, { useState, useEffect } from 'react';
import { categoryService } from '../../../services/api';
import '../productos.css';

const CategoryStats = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas de categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalProducts = categories.reduce((sum, cat) => sum + parseInt(cat.products_count || 0), 0);

  return (
    <div className="category-stats">
      <h2>Indicadores de productos</h2>
      <div className="stats-summary">
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>Categorías</p>
        </div>
        <div className="stat-card">
          <h3>{totalProducts}</h3>
          <p>Productos Total</p>
        </div>
      </div>
      
      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description || 'Sin descripción'}</p>
            </div>
            <div className="category-count">
              <span className="product-count">{category.products_count || 0}</span>
              <p>productos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStats;
