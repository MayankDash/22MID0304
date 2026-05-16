const { v4: uuidv4 } = require("uuid");
const repo = require("../repositories/notificationsRepo");
const { isValidType, isValidPriority } = require("../utils/validation");

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return null;
}

async function listNotifications(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );
    const type = req.query.type;
    const priority = req.query.priority;
    const isReadParam = req.query.isRead;

    if (type && !isValidType(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }
    if (priority && !isValidPriority(priority)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid priority" });
    }

    let isRead;
    if (typeof isReadParam !== "undefined") {
      const parsed = parseBoolean(isReadParam);
      if (parsed === null) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid isRead" });
      }
      isRead = parsed;
    }

    const { total, rows } = await repo.listNotifications({
      page,
      limit,
      type,
      isRead,
      priority,
    });

    res.json({ success: true, page, limit, total, notifications: rows });
  } catch (err) {
    next(err);
  }
}

async function getNotificationById(req, res, next) {
  try {
    const id = req.params.id;
    const n = await repo.getById(id);
    if (!n)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, notification: n });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const id = req.params.id;
    const isReadBody = req.body && req.body.isRead;
    const isRead = typeof isReadBody === "boolean" ? isReadBody : true;
    const updated = await repo.updateRead(id, isRead);
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
}

async function markMultipleAsRead(req, res, next) {
  try {
    const ids = (req.body && req.body.notificationIds) || [];
    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, message: "notificationIds must be array" });
    }
    const updated = await repo.updateMultipleRead(ids);
    res.json({ success: true, updatedCount: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const id = req.params.id;
    const removed = await repo.deleteById(id);
    if (!removed)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
}

async function createNotification(req, res, next) {
  try {
    const payload = req.body || {};
    const type = payload.type || "Placement";
    const priority = payload.priority || "MEDIUM";
    if (!isValidType(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }
    if (!isValidPriority(priority)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid priority" });
    }

    const notification = await repo.createNotification({
      id: uuidv4(),
      studentId: payload.studentId || uuidv4(),
      type,
      title: payload.title || "New Notification",
      message: payload.message || "You have a new notification",
      priority,
      isRead: false,
    });

    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`student:${notification.studentId}`).emit("new_notification", {
          event: "new_notification",
          data: notification,
        });
      }
    } catch (err) {}

    res.status(201).json({ success: true, notification });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listNotifications,
  getNotificationById,
  markAsRead,
  markMultipleAsRead,
  deleteNotification,
  createNotification,
};
