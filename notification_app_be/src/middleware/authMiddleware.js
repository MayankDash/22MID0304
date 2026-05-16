function authMiddleware(req, res, next) {
  if (process.env.AUTH_REQUIRED !== "1") return next();

  const header = req.headers.authorization || "";
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  req.authToken = parts[1];
  return next();
}

module.exports = authMiddleware;
