const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

module.exports = async (req, res, next) => {
  
  // Get token from header
  let token = req.headers['x-access-token'] || req.headers['authorization']; 

  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");
  
  // Check if no token
  if(!token) {
    return res.status(401).json({ msg: 'No token, authorization denied.' });
  }

  // Verity token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = await User.findById(decoded.user.id).exec();
    next(); // If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function.
  } catch(err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}