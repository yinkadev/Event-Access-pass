const express = require("express");
const router = express.Router();


const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  bookEvent,
  getMyBookings,
   getAllBookings,
  getBookingById,
  completeDemoPayment,
  verifyTicket,
  checkInTicket
} = require("../Controller/bookingController");

router.get("/my-bookings", protect, getMyBookings);
router.get("/admin/all", protect, admin, getAllBookings);

router.post("/:eventId", protect, bookEvent);

router.get("/:id", protect, getBookingById);
router.patch("/:id/demo-payment", protect, completeDemoPayment);
router.get("/verify/:ticketCode", verifyTicket);
router.patch("/check-in/:ticketCode", protect, admin, checkInTicket);


module.exports = router;