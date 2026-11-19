const express = require("express");
const router = express.Router();


const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  bookEvent,
  getMyBookings,
  getBookingById,
  verifyTicket,
  checkInTicket
} = require("../Controller/bookingController");

router.get("/my-bookings", protect, getMyBookings);

router.post("/:eventId", protect, bookEvent);

router.get("/:id", protect, getBookingById);
router.get("/verify/:ticketCode", verifyTicket);
router.patch("/check-in/:ticketCode", protect, admin, checkInTicket);


module.exports = router;