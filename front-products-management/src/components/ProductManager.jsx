import React, { useState } from 'react';
import { ProductTable, ProductForm, CategoryStats } from '../modules/productos';
import '../modules/productos/productos.css';

const ProductManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    // Limpiar localStorage para forzar recarga
    localStorage.removeItem('latestProducts');
    // Actualizar trigger para forzar recarga de componentes
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };


  return (
    <div className="product-manager">
      <header className="product-header">
        <h1>Gestionar productos</h1>
        <nav>
          <button 
            className="btn btn-primary"
            onClick={handleNewProduct}
          >
            Nuevo Producto
          </button>
        </nav>
      </header>

      <main className="product-main">
        {showForm ? (
          <ProductForm
            product={editingProduct}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        ) : (
          <div className="admin-view">
            <CategoryStats key={`stats-${refreshTrigger}`} />
            <ProductTable key={`table-${refreshTrigger}`} onEditProduct={handleEditProduct} onNewProduct={handleNewProduct} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductManager;
