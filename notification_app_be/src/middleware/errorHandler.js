function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (req && req.Log) {
    req
      .Log("backend", "error", "handler", err.message || "Unhandled error")
      .catch(() => {});
  }
  const payload = {
    success: false,
    message: err.message || "Internal Server Error",
  };
  if (process.env.NODE_ENV === "development" && err.details) {
    payload.details = err.details;
  }
  res.status(status).json(payload);
}

module.exports = errorHandler;
