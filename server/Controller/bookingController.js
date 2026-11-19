const crypto = require("crypto");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Event = require("../models/event");

const bookEvent = async (req, res) => {
  let reservedEvent = null;
  let quantity = Number(req.body.quantity ?? 1);
  try {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ success: false, message: "Choose a quantity between 1 and 10." });
    }
    if (!mongoose.isValidObjectId(req.params.eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event reference." });
    }

    // This conditional update reserves tickets in one database operation, preventing overselling.
   reservedEvent = await Event.findOneAndUpdate(
  {
    _id: req.params.eventId,
    ticketsAvailable: { $gte: quantity },
    isCancelled: { $ne: true },
  },
  { $inc: { ticketsAvailable: -quantity } },
  { new: true }
);
   if (!reservedEvent) {
  const existingEvent = await Event.findById(req.params.eventId);

  if (!existingEvent) {
    return res.status(404).json({
      success: false,
      message: "Event not found.",
    });
  }

  if (existingEvent.isCancelled) {
    return res.status(400).json({
      success: false,
      message: "This event has been cancelled and is no longer available for booking.",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Not enough tickets available.",
  });
}

    const booking = await Booking.create({
      user: req.user._id,
      event: reservedEvent._id,
      quantity,
      totalPrice: Number(reservedEvent.price || 0) * quantity,
      ticketCode: `ACP-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
    });

    return res.status(201).json({ success: true, message: "Booking created. Payment is pending.", booking });
  } catch (error) {
    // Return the reserved seats if booking creation failed after inventory was reduced.
    if (reservedEvent) await Event.updateOne({ _id: reservedEvent._id }, { $inc: { ticketsAvailable: quantity } }).catch(() => {});
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A ticket reference collision occurred. Please try again." });
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: "We couldn't complete this booking. Please try again." });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("event", "title venue date price image").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your bookings." });
  }
};

const getBookingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid booking reference." });
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "You cannot access this booking." });
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({ success: false, message: "Unable to load this booking." });
  }
};

const verifyTicket = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.ticketCode.toUpperCase() }).populate("event");
    if (!booking) return res.status(404).json({ success: false, message: "Invalid ticket." });
    return res.status(200).json({ success: true, booking, ticketStatus: booking.checkedIn || booking.ticketStatus === "used" ? "used" : booking.ticketStatus, message: booking.checkedIn || booking.ticketStatus === "used" ? "This ticket has already been checked in." : "Ticket found. Confirm payment before admitting the holder." });
  } catch (error) {
    console.error("Verify ticket error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify this ticket." });
  }
};

const checkInTicket = async (req, res) => {
  try {
    const ticketCode = String(req.params.ticketCode || "").toUpperCase();
    const booking = await Booking.findOneAndUpdate(
      { ticketCode, paymentStatus: "paid", ticketStatus: "active", checkedIn: false },
      { $set: { checkedIn: true, checkedInAt: new Date(), ticketStatus: "used" } },
      { new: true }
    );
    if (booking) return res.status(200).json({ success: true, message: "Ticket checked in successfully.", booking });
    const existing = await Booking.findOne({ ticketCode });
    if (!existing) return res.status(404).json({ success: false, message: "Ticket not found." });
    if (existing.paymentStatus !== "paid") return res.status(400).json({ success: false, message: "Payment must be confirmed before check-in." });
    return res.status(409).json({ success: false, message: "This ticket has already been checked in or is no longer active." });
  } catch (error) {
    console.error("Ticket check-in error:", error);
    return res.status(500).json({ success: false, message: "Unable to check in this ticket." });
  }
};

module.exports = { bookEvent, getMyBookings, getBookingById, verifyTicket, checkInTicket };
