const { Log } = require("../../../logging_middleware");

function requestLogger(req, res, next) {
  const start = Date.now();
  req.Log = Log;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const msg = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    req.Log("backend", "info", "route", msg).catch(() => {});
  });

  next();
}

module.exports = { Log, requestLogger };
