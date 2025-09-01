const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(req.headers);
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // { id, email, role }
    next();
  });
}

module.exports = { authenticate };
