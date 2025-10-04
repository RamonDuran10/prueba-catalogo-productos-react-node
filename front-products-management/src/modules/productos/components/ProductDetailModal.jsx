import React from 'react';
import '../productos.css';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content product-detail-modal">
        <div className="modal-header">
          <h2>Detalle del Producto</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="product-detail-content">
            <div className="product-detail-image">
              <img 
                src={product.image_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                alt={product.title}
                className="detail-product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                }}
              />
            </div>
            
            <div className="product-detail-info">
              <div className="detail-field">
                <label>Nombre del producto:</label>
                <p className="detail-value">{product.title}</p>
              </div>
              
              <div className="detail-field">
                <label>Precio:</label>
                <p className="detail-value price">${product.price}</p>
              </div>
              
              <div className="detail-field">
                <label>Categoría:</label>
                <p className="detail-value category">{product.category_name || 'Sin categoría'}</p>
              </div>
              
              <div className="detail-field">
                <label>Descripción:</label>
                <p className="detail-value description">
                  {product.description || 'Sin descripción disponible'}
                </p>
              </div>
              
              {product.category_description && (
                <div className="detail-field">
                  <label>Descripción de la categoría:</label>
                  <p className="detail-value category-description">
                    {product.category_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
