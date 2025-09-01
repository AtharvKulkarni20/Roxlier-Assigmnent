const db = require("../config/db");

// Get all stores (for normal users)
exports.getAllStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user.id;
    
    let query = `
      SELECT s.id, s.name, s.address, s.email,
             AVG(r.rating) as avg_rating,
             COUNT(r.id) as total_ratings,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
    `;
    
    let params = [userId];
    
    // Add search functionality
    if (search) {
      query += ` WHERE (s.name LIKE ? OR s.address LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` GROUP BY s.id, s.name, s.address, s.email, ur.rating`;
    
    // Add sorting
    const validSortFields = ['name', 'address', 'avg_rating'];
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
      address: store.address,
      email: store.email,
      averageRating: store.avg_rating ? parseFloat(store.avg_rating).toFixed(2) : '0.00',
      totalRatings: store.total_ratings,
      userRating: store.user_rating || null
    }));
    
    res.json({ stores: formattedStores });
  } catch (err) {
    console.error("Get All Stores Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Submit or update rating for a store
exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    
    // Check if store exists
    const [stores] = await db.query("SELECT id FROM stores WHERE id = ?", [storeId]);
    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    
    // Check if user already rated this store
    const [existingRating] = await db.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );
    
    if (existingRating.length > 0) {
      // Update existing rating
      await db.query(
        "UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
      res.json({ message: "Rating updated successfully" });
    } else {
      // Insert new rating
      await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );
      res.status(201).json({ message: "Rating submitted successfully" });
    }
  } catch (err) {
    console.error("Submit Rating Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user's own ratings
exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [ratings] = await db.query(`
      SELECT r.id, r.rating, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = ?
      ORDER BY r.updated_at DESC
    `, [userId]);
    
    res.json({ ratings });
  } catch (err) {
    console.error("Get My Ratings Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUser = async (req, res) => {
    try {
    
    const [users] = await db.query(
      "SELECT id, name, email, address, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ ...users[0] });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}