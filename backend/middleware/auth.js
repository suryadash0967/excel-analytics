const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ msg: "No token, access denied" });

  // Support "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verified.id, role: verified.role };
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};
