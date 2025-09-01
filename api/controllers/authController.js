const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../utils/validators");

// Signup (NORMAL user by default)
exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    const error = validateUser({ name, address, email, password });
    if (error) return res.status(400).json({ error });

    // check if email exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'NORMAL')",
      [name, email, hashed, address]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
  console.log("Request Body:", req.body);
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) return res.status(400).json({ error: "User not found" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    

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
