const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationsController");

// GET /api/v1/notifications
router.get("/", controller.listNotifications);

// GET /api/v1/notifications/:id
router.get("/:id", controller.getNotificationById);

// PATCH /api/v1/notifications/:id/read
router.patch("/:id/read", controller.markAsRead);

// PATCH /api/v1/notifications/read-all
router.patch("/read-all", controller.markMultipleAsRead);

// DELETE /api/v1/notifications/:id
router.delete("/:id", controller.deleteNotification);

// POST /api/v1/notifications/seed  (helper - not part of exam spec but useful)
router.post("/seed", controller.createNotification);

module.exports = router;
