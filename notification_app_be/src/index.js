require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const notificationsRouter = require("./routes/notifications");
const loggingMiddleware = require("./middleware/loggingMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware.requestLogger);
app.use(authMiddleware);

// attach io so controllers can emit
app.set("io", io);

app.use("/api/v1/notifications", notificationsRouter);

io.on("connection", (socket) => {
  socket.on("subscribe", (payload) => {
    if (!payload || !payload.studentId) return;
    socket.join(`student:${payload.studentId}`);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  server.listen(PORT, () => {
    loggingMiddleware
      .Log("backend", "info", "route", `Server started on port ${PORT}`)
      .catch(() => {});
  });
}

module.exports = { app, server };
