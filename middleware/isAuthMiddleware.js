const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = isAuth;
