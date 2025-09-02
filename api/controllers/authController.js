const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validateUser } = require("../utils/validators");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User with this email does not exist" });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to database
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [resetTokenHash, resetTokenExpiry, user.id]
    );

    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetURL}</p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent to:", email);

    res.json({ 
      message: "Password reset link has been sent to your email address" 
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email: " + err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: "Token, email, and new password are required" });
    }

    // Hash the provided token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiry > ?",
      [email, resetTokenHash, new Date()]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const user = users[0];

    // Validate new password
    const error = validateUser({ 
      name: user.name, 
      address: user.address, 
      email: email, 
      password: newPassword 
    });
    if (error) return res.status(400).json({ error });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password has been reset successfully" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Password (existing function)
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