const jwt = require('jsonwebtoken');
const { SECRET } = require("./constants");


const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ err: true, msg: 'Unauthorized.' });
  }
  jwt.verify(authHeader, SECRET, (err, decoded) => {
    if(err) {
      return res.status(403).json({ err: true, msg: 'Unable to verify user' });
    }
    req.userID = decoded.userID;
    next();
  });
}

module.exports = { auth };
