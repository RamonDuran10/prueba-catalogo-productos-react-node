import React, { useState, useEffect } from 'react';
import { categoryService } from '../../../services/api';
import { showDeleteConfirm, showSuccess, showError } from '../../../utils/alerts';
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

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const result = await showDeleteConfirm(
      '¿Eliminar categoría?',
      `¿Estás seguro de que quieres eliminar "${categoryName}"? Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        // TODO: Implementar endpoint de eliminación en el backend
        // await categoryService.delete(categoryId);
        await showSuccess('Categoría eliminada', 'La categoría ha sido eliminada correctamente.');
        fetchCategories();
      } catch (err) {
        await showError('Error al eliminar', 'No se pudo eliminar la categoría. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalProducts = categories.reduce((sum, cat) => sum + parseInt(cat.products_count || 0), 0);

  return (
    <div className="category-stats">
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
      
      <div className="category-chips">
        <h3>Categorías disponibles</h3>
        <div className="chips-container">
          {categories.map((category) => (
            <div key={category.id} className="category-chip">
              <span className="chip-name">{category.name}</span>
              <span className="chip-count">{category.products_count || 0}</span>
              <button
                className="chip-delete"
                onClick={() => handleDeleteCategory(category.id, category.name)}
                title="Eliminar categoría"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;
