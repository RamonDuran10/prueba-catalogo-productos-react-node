import React, { useState, useEffect } from 'react';
import { productService } from '../../../services/api';
import { showDeleteConfirm, showSuccess, showError } from '../../../utils/alerts';
import '../productos.css';

const ProductTable = ({ onEditProduct, onNewProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchProducts(pagination.currentPage);
  }, []);


  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productService.getAll(page, pagination.limit);
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

  const handleDelete = async (id, productTitle) => {
    const result = await showDeleteConfirm(
      '¿Eliminar producto?',
      `¿Estás seguro de que quieres eliminar "${productTitle}"? Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        await productService.delete(id);
        await showSuccess('Producto eliminado', 'El producto ha sido eliminado correctamente.');
        fetchProducts(pagination.currentPage);
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
    fetchProducts(newPage);
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h2>Lista de Productos</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => fetchProducts(pagination.currentPage)}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
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
    </div>
  );
};

export default ProductTable;
