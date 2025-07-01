const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ msg: "No token, access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID and role to the request
    req.user = {
      id: verified.id,
      role: verified.role
    };

    next(); // Proceed to next middleware/route
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};
