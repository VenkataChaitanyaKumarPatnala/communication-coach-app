// server/src/api/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add user from payload to the request object
    req.user = decoded.user;
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };