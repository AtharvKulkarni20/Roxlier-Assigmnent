const db = require("../config/db");

// Get store dashboard stats (for store owners)
exports.getDashboard = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;
    
    // Get store owned by this user
    const [stores] = await db.query(
      "SELECT id, name FROM stores WHERE owner_id = ?",
      [storeOwnerId]
    );
    
    if (stores.length === 0) {
      return res.status(404).json({ error: "No store found for this owner" });
    }
    
    const store = stores[0];
    
    // Get average rating for the store
    const [avgRating] = await db.query(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings
      FROM ratings 
      WHERE store_id = ?
    `, [store.id]);
    
    // Get list of users who rated the store
    const [ratingUsers] = await db.query(`
      SELECT u.id, u.name, u.email, r.rating, r.created_at, r.updated_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `, [store.id]);
    
    res.json({
      store: {
        id: store.id,
        name: store.name,
        averageRating: avgRating[0].avg_rating ? parseFloat(avgRating[0].avg_rating).toFixed(2) : 0,
        totalRatings: avgRating[0].total_ratings
      },
      ratingUsers
    });
  } catch (err) {
    console.error("Store Dashboard Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update store owner password (inherited from auth, but specific route)
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    const bcrypt = require('bcrypt');
    const user = users[0];
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ error: "Old password incorrect" });

    const { validateUser } = require("../utils/validators");
    const error = validateUser({ name: user.name, address: user.address, email: user.email, password: newPassword });
    if (error) return res.status(400).json({ error });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
