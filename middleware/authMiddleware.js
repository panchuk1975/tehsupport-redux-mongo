const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); //allow continued execution request
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    // need to reparse string with 'space' separated our Token string "Bearer Token"
    // separate with "  " and take first element Token (throw 0 element Bearer)
    if (!token) {// if token isn't exist
      return res.status(401).json({ message: "User without authorisation!" });
    } // if token exist we need to decode it use Secret from config
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded; // put to req.user value decoder
    next(); // allow continued execution request
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
};
