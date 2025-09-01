const db = require("../config/db");

// Dashboard stats
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await db.query(
      "SELECT id, name, email, address, role, created_at FROM users WHERE id = ?",
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: users[0] });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add new user
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role = 'NORMAL' } = req.body;

    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Name, email, and password are required" 
      });
    }
    
    // Check if email already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );
    
    res.status(201).json({ 
      message: "User created successfully",
      userId: result.insertId
    });
  } catch (err) {
    console.error("Add User Error:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Delete user (CASCADE will handle related records)
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// List all users (already implemented)
exports.listUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, address, role FROM users");
    res.json({ users });
  } catch (err) {
    console.error("List Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stores] = await db.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             u.name as owner_name, u.email as owner_email, u.id as owner_id,
             AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings
      FROM stores s 
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
    `, [id]);
    
    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    
    const store = stores[0];
    store.avg_rating = store.avg_rating ? parseFloat(store.avg_rating).toFixed(2) : '0.00';
    
    res.json({ store });
  } catch (err) {
    console.error("Get Store Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listStores = async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             u.name as owner_name, u.email as owner_email
      FROM stores s 
      JOIN users u ON s.owner_id = u.id
      ORDER BY s.created_at DESC
    `);
    
    res.json({ stores });
  } catch (err) {
    console.error("List Stores Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add new store
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    
    if (!name || !owner_id) {
      return res.status(400).json({ 
        error: "Store name and owner ID are required" 
      });
    }
    
    const [owners] = await db.query(
      "SELECT id, role FROM users WHERE id = ? AND role IN ('OWNER', 'ADMIN')",
      [owner_id]
    );
    
    if (owners.length === 0) {
      return res.status(400).json({ 
        error: "Owner not found or user doesn't have OWNER/ADMIN role" 
      });
    }
    
    if (email) {
      const [existingStores] = await db.query(
        "SELECT id FROM stores WHERE email = ?",
        [email]
      );
      
      if (existingStores.length > 0) {
        return res.status(400).json({ error: "Store email already exists" });
      }
    }
    
    const [result] = await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id]
    );
    
    res.status(201).json({ 
      message: "Store created successfully",
      storeId: result.insertId
    });
  } catch (err) {
    console.error("Add Store Error:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: "Store email already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stores] = await db.query("SELECT id FROM stores WHERE id = ?", [id]);
    
    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    
    await db.query("DELETE FROM stores WHERE id = ?", [id]);
    
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Delete Store Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await db.query("SELECT COUNT(*) as count FROM users");
    const [storeCount] = await db.query("SELECT COUNT(*) as count FROM stores");
    const [ratingCount] = await db.query("SELECT COUNT(*) as count FROM ratings");
    
    // Get role distribution
    const [roleStats] = await db.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    // Get average ratings per store
    const [avgRatings] = await db.query(`
      SELECT s.name as store_name, AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      GROUP BY s.id, s.name
      ORDER BY avg_rating DESC
      LIMIT 10
    `);
    
    res.json({
      stats: {
        totalUsers: userCount[0].count,
        totalStores: storeCount[0].count,
        totalRatings: ratingCount[0].count,
        roleDistribution: roleStats,
        topRatedStores: avgRatings
      }
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const { sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
    let query = `
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             u.name as user_name, u.email as user_email,
             s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
    `;
    
    // Add sorting
    const validSortFields = ['created_at', 'updated_at', 'rating', 'user_name', 'store_name'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }
    
    const [ratings] = await db.query(query);
    
    res.json({ ratings });
  } catch (err) {
    console.error("Get All Ratings Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Enhanced list users with filters
exports.listUsersWithFilters = async (req, res) => {
  try {
    const { search, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings,
             s.name as store_name
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'OWNER'
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    let conditions = [];
    let params = [];
    
    // Add search functionality
    if (search) {
      conditions.push(`(u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Add role filter
    if (role && ['ADMIN', 'NORMAL', 'OWNER'].includes(role)) {
      conditions.push(`u.role = ?`);
      params.push(role);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }
    
    query += ` GROUP BY u.id`;
    
    // Add sorting
    const validSortFields = ['name', 'email', 'role', 'created_at', 'avg_rating'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY name ASC`;
    }
    
    const [users] = await db.query(query, params);
    
    // Format the response
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      created_at: user.created_at,
      ...(user.role === 'OWNER' && {
        store_name: user.store_name,
        avg_rating: user.avg_rating ? parseFloat(user.avg_rating).toFixed(2) : null,
        total_ratings: user.total_ratings
      })
    }));
    
    res.json({ users: formattedUsers });
  } catch (err) {
    console.error("List Users With Filters Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listStoresWithFilters = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             u.name as owner_name, u.email as owner_email,
             AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings
      FROM stores s 
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    let params = [];
    
    // Add search functionality
    if (search) {
      query += ` WHERE (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ` GROUP BY s.id`;
    
    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'created_at', 'avg_rating', 'owner_name'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ` ORDER BY name ASC`;
    }
    
    const [stores] = await db.query(query, params);
    
    // Format the response
    const formattedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      created_at: store.created_at,
      owner_name: store.owner_name,
      owner_email: store.owner_email,
      avg_rating: store.avg_rating ? parseFloat(store.avg_rating).toFixed(2) : '0.00',
      total_ratings: store.total_ratings
    }));
    
    res.json({ stores: formattedStores });
  } catch (err) {
    console.error("List Stores With Filters Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};