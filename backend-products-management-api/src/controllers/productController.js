const pool = require('../database/Dbconn');

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchName = req.query.search || '';
    const categoryId = req.query.category_id || '';

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (searchName) {
      // Búsqueda simple con ILIKE
      whereConditions.push(`(
        p.title ILIKE $${paramIndex} OR 
        p.description ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${searchName}%`);
      paramIndex++;
    }

    if (categoryId) {
      whereConditions.push(`p.category_id = $${paramIndex}`);
      queryParams.push(categoryId);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Crear parámetros separados para la consulta de conteo
    const countParams = [];
    
    if (searchName) {
      countParams.push(`%${searchName}%`);
    }
    
    if (categoryId) {
      countParams.push(categoryId);
    }

    const countQuery = `
      SELECT COUNT(*) FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, countParams);
    const totalProducts = parseInt(countResult.rows[0].count);

    // Construir ORDER BY dinámico basado en si hay búsqueda
    let orderByClause = 'ORDER BY p.id';
    if (searchName) {
      orderByClause = `ORDER BY 
        CASE 
          WHEN p.title ILIKE $1 THEN 1
          WHEN p.description ILIKE $1 THEN 2
          ELSE 3
        END,
        p.id`;
    }

    const dataQuery = `
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderByClause}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(dataQuery, queryParams);

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      message: 'Products retrieved successfully',
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving products',
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [productId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Product not found',
        message: `Product with id ${id} does not exist`
      });
    }
    
    res.json({
      message: 'Product retrieved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving product',
      message: error.message
    });
  }
};

    const createProduct = async (req, res) => {
      try {
        const { title, price, description, categoryId, imageUrl } = req.body;

        const result = await pool.query(`
          INSERT INTO products (title, price, description, category_id, image_url)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [title, price, description, categoryId, imageUrl]);

        // Obtener todos los productos actualizados con información de categorías
        const allProducts = await pool.query(`
          SELECT p.*, c.name as category_name, c.description as category_description
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.id
        `);

        res.status(201).json({
          message: 'Product created successfully',
          data: result.rows[0],
          products: allProducts.rows
        });
      } catch (error) {
        res.status(500).json({
          error: 'Error creating product',
          message: error.message
        });
      }
    };

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description, categoryId, imageUrl } = req.body;
    const productId = parseInt(id);

    const result = await pool.query(`
      UPDATE products
      SET title = $1, price = $2, description = $3, category_id = $4, image_url = $5
      WHERE id = $6
      RETURNING *
    `, [title, price, description, categoryId, imageUrl, productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Product not found',
        message: `Product with id ${id} does not exist`
      });
    }

    // Obtener todos los productos actualizados con información de categorías
    const allProducts = await pool.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);

    res.json({
      message: 'Product updated successfully',
      data: result.rows[0],
      products: allProducts.rows
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating product',
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Product not found',
        message: `Product with id ${id} does not exist`
      });
    }

    // Obtener todos los productos actualizados con información de categorías
    const allProducts = await pool.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);

    res.json({
      message: 'Product deleted successfully',
      id: productId,
      products: allProducts.rows
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting product',
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
