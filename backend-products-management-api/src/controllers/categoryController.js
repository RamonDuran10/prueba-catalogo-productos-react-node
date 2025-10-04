const pool = require('../database/Dbconn');

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id
    `);
    
    res.json({
      message: 'Categories retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving categories',
      message: error.message
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    
    const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with id ${id} does not exist`
      });
    }
    
    const productsResult = await pool.query('SELECT * FROM products WHERE category_id = $1', [categoryId]);
    
    const category = categoryResult.rows[0];
    category.products = productsResult.rows;
    category.products_count = productsResult.rows.length;
    
    res.json({
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving category',
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validar que se proporcione el nombre
    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Category name is required'
      });
    }
    
    // Verificar si la categoría ya existe (case-insensitive)
    const existingCategory = await pool.query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
      [name.trim()]
    );
    
    if (existingCategory.rows.length > 0) {
      return res.status(409).json({
        error: 'Category already exists',
        message: `A category with the name "${name}" already exists`
      });
    }
    
    // Crear la nueva categoría
    const result = await pool.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name.trim(), description?.trim() || null]);
    
    res.status(201).json({
      message: 'Category created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    // Manejar error de restricción única de la base de datos
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Category already exists',
        message: 'A category with this name already exists'
      });
    }
    
    res.status(500).json({
      error: 'Error creating category',
      message: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    
    // Verificar si la categoría existe
    const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with id ${id} does not exist`
      });
    }
    
    // Verificar si hay productos asociados a esta categoría
    const productsResult = await pool.query('SELECT COUNT(*) FROM products WHERE category_id = $1', [categoryId]);
    const productCount = parseInt(productsResult.rows[0].count);
    
    if (productCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category',
        message: `Cannot delete category because it has ${productCount} associated products. Please move or delete the products first.`
      });
    }
    
    // Eliminar la categoría
    const deleteResult = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);
    
    res.json({
      message: 'Category deleted successfully',
      data: deleteResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting category',
      message: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory
};
