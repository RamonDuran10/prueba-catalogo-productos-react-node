import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../../services/api';
import { showDeleteConfirm, showSuccess, showError } from '../../../utils/alerts';
import ProductDetailModal from './ProductDetailModal';
import '../productos.css';

const ProductTable = ({ onEditProduct, onNewProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category_id: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchProductsWithFilters(pagination.currentPage);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };



  const handleDelete = async (id, productTitle) => {
    const result = await showDeleteConfirm(
      '¿Eliminar producto?',
      `¿Estás seguro de que quieres eliminar "${productTitle}"? Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        await productService.delete(id);
        await showSuccess('Producto eliminado', 'El producto ha sido eliminado correctamente.');
        fetchProductsWithFilters(pagination.currentPage);
      } catch (err) {
        await showError('Error al eliminar', 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    onEditProduct(product);
  };

  const handlePageChange = (newPage) => {
    fetchProductsWithFilters(newPage);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProductsWithFilters(1);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category_id: ''
    };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Fetch products with cleared filters immediately
    fetchProductsWithFilters(1, clearedFilters);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  // Verificar si hay filtros aplicados
  const hasActiveFilters = filters.search.trim() !== '' || filters.category_id !== '';

  // Verificar si los filtros han cambiado desde el último fetch
  const hasFiltersChanged = () => {
    return filters.search.trim() !== '' || filters.category_id !== '';
  };

  const fetchProductsWithFilters = async (page = 1, filtersToUse = filters) => {
    try {
      setLoading(true);
      const response = await productService.getAll(page, pagination.limit, filtersToUse);
      setProducts(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
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
    <div className="product-table-container">
      <div className="table-header">
        <h2>Lista de Productos</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => fetchProductsWithFilters(pagination.currentPage)}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="search-filter">Buscar por nombre:</label>
            <input
              id="search-filter"
              type="text"
              placeholder="Ingresa el nombre del producto..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Categoría:</label>
            <select
              id="category-filter"
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleApplyFilters}
              disabled={loading || !hasFiltersChanged()}
              title={!hasFiltersChanged() ? "No hay filtros para aplicar" : "Aplicar filtros"}
            >
              Filtrar
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
              disabled={loading || !hasActiveFilters}
              title={!hasActiveFilters ? "No hay filtros para limpiar" : "Limpiar filtros"}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
      
      <div className="table-wrapper">
        {products.length > 0 ? (
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/50x50?text=Sin+Imagen'} 
                      alt={product.title}
                      className="product-table-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=Sin+Imagen';
                      }}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>${product.price}</td>
                  <td>{product.category_name || 'N/A'}</td>
                  <td className="description-cell">
                    {product.description ? 
                      (product.description.length > 100 ? 
                        `${product.description.substring(0, 100)}...` : 
                        product.description
                      ) : 'Sin descripción'
                    }
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetail(product)}
                        title="Ver detalles del producto"
                      >
                        Ver
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id, product.title)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No hay productos cargados</h3>
            <p>Comienza agregando tu primer producto para verlo aquí.</p>
            <button 
              className="btn btn-primary"
              onClick={() => onNewProduct && onNewProduct()}
            >
              Crear Producto
            </button>
          </div>
        )}
      </div>

      {/* Paginación - solo mostrar si hay productos */}
      {products.length > 0 && (
        <div className="pagination">
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Anterior
          </button>
          
          <span className="pagination-info">
            Página {pagination.currentPage} de {pagination.totalPages} 
            ({pagination.totalProducts} productos total)
          </span>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de detalle del producto */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default ProductTable;
