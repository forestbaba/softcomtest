const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  } else {
    //Verify token
    try {
      let splitted = token.split("Bearer ")
      const decoded = jwt.verify(splitted[1], require('./config').secret);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: true, message: "invalid token" });
    }
  }


};
