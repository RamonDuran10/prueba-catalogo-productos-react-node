import React from 'react';

const ProductTableCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
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
            onClick={() => onEdit(product)}
          >
            Editar
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(product.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTableCard;
