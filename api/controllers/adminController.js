const db = require("../config/db");

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalStores }]] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[{ totalRatings }]] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, address, role FROM users");
    res.json({ users });
  } catch (err) {
    console.error("List Users Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// List all stores
exports.listStores = async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT s.id, s.name, s.email, s.address,
        IFNULL(AVG(r.rating), 0) AS averageRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.storeId
      GROUP BY s.id
    `);
    res.json({ stores });
  } catch (err) {
    console.error("List Stores Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
