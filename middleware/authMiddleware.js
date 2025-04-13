const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const authMiddleware = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'This token is invalid. Please log in again.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;












