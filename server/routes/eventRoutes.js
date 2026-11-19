const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  cancelEvent,
} = require("../Controller/eventcontroller");


router.get("/", getEvents);

router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.patch("/:id/cancel", protect, admin, cancelEvent);
router.delete("/:id", protect, admin, deleteEvent);

router.get("/:id", getEventById);

module.exports = router;