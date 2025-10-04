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
    
    const result = await pool.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description]);
    
    res.status(201).json({
      message: 'Category created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error creating category',
      message: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory
};
