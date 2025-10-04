import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../../services/api';
import { showSuccess, showError, showConfirm } from '../../../utils/alerts';
import '../productos.css';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        title: product.title || '',
        price: product.price || '',
        description: product.description || '',
        categoryId: product.category_id || '',
        imageUrl: product.image_url || ''
      });
      setImagePreview(product.image_url || '');
    }
  }, [product]);

  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    }
  }, [formData.imageUrl]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Debe seleccionar una categoría';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'La URL de la imagen no es válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl.trim() || null
      };

      const response = await (product ? 
        productService.update(product.id, productData) : 
        productService.create(productData)
      );

      await showSuccess(
        product ? 'Producto actualizado' : 'Producto creado',
        product ? 'El producto ha sido actualizado correctamente.' : 'El producto ha sido creado correctamente.'
      );
      onSave();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      await showError('Error al guardar', 'No se pudo guardar el producto. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // Solo mostrar confirmación si hay datos ingresados
    const hasData = formData.title || formData.price || formData.description || formData.categoryId || formData.imageUrl;
    
    if (hasData) {
      const result = await showConfirm(
        '¿Descartar cambios?',
        'Se perderán los cambios no guardados. ¿Estás seguro de que quieres volver?'
      );
      
      if (!result.isConfirmed) {
        return;
      }
    }
    
    onCancel();
  };

  return (
    <div className="product-form-container">
      <div className="product-form">
        <div className="form-header">
          <div className="form-header-top">
            <button 
              className="btn-back"
              onClick={handleCancel}
              title="Volver"
            >
              ← Volver
            </button>
            <div className="form-title">
              <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <div className="form-breadcrumb">
                <span>Administración</span>
                <span>→</span>
                <span>{product ? 'Editar' : 'Crear'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form-content">
          <div className="form-grid">
            <div className="form-section">
              <h3>Información Básica</h3>
              
              <div className="form-group">
                <label htmlFor="title">
                  Título <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                  placeholder="Ej: Mochila Fjallraven"
                  maxLength="255"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Precio <span className="required">*</span>
                </label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? 'error' : ''}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">
                  Categoría <span className="required">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={errors.categoryId ? 'error' : ''}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Descripción e Imagen</h3>
              
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe las características del producto..."
                  maxLength="1000"
                />
                <div className="character-count">
                  {formData.description.length}/1000 caracteres
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">URL de Imagen</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={errors.imageUrl ? 'error' : ''}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
              </div>

              {imagePreview && (
                <div className="form-group">
                  <label>Vista Previa</label>
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : (
                product ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
