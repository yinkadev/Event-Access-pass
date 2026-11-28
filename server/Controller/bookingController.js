
const crypto = require("crypto");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Event = require("../models/event");
const QRCode = require("qrcode");
const { sendEmail } = require("../utils/EmailService");

// Generate a unique ticket reference
const generateTicketCode = () => {
  return `ACP-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
};

// Send booking and payment notification emails
const sendBookingNotification = async (bookingId, paymentConfirmed = false) => {
  const booking = await Booking.findById(bookingId)
    .populate("user", "name email")
    .populate("event", "title venue date");

  if (!booking || !booking.user?.email) {
    throw new Error("Booking customer email could not be found.");
  }

  const escapeHtml = (value) => {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  };

  const customerName = booking.user.name || "Customer";
  const eventTitle = booking.event?.title || "Your event";
  const eventVenue = booking.event?.venue || "To be confirmed";

  const eventDate = booking.event?.date
    ? new Date(booking.event.date).toLocaleString("en-GB")
    : "To be confirmed";

  const safeCustomerName = escapeHtml(customerName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeEventVenue = escapeHtml(eventVenue);
  const safeEventDate = escapeHtml(eventDate);

  const safeSubjectTitle = String(eventTitle)
    .replace(/[\r\n]+/g, " ")
    .slice(0, 150);

  const attachments = [];

  const ticketRows = (booking.tickets || []).map((ticket, index) => {
    const safeTicketCode = escapeHtml(ticket.ticketCode);

    let qrSection = "";

    if (paymentConfirmed && ticket.qrCode) {
      const qrBase64 = ticket.qrCode.split(",")[1];
      const cid = `accesspass-qr-${index}`;

      if (qrBase64) {
        attachments.push({
          filename: `accesspass-ticket-${index + 1}.png`,
          content: Buffer.from(qrBase64, "base64"),
          contentType: "image/png",
          cid,
        });

        qrSection = `
          <div style="text-align:center; margin:15px 0; padding:15px; border:1px solid #ddd; border-radius:8px;">
            <h4>Ticket ${index + 1}</h4>
            <p><strong>Ticket code:</strong> ${safeTicketCode}</p>
            <img src="cid:${cid}" alt="QR code for ticket ${index + 1}" width="160" height="160" />
            <p>Present this QR code at the event entrance.</p>
          </div>
        `;
      }
    } else {
      qrSection = `
        <p><strong>Ticket ${index + 1} reference:</strong> ${safeTicketCode}</p>
      `;
    }

    return qrSection;
  }).join("");

  const subject = paymentConfirmed
    ? `Your AccessPass tickets are confirmed - ${safeSubjectTitle}`
    : `Booking confirmation - ${safeSubjectTitle}`;

  const html = `
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; color:#17202a;">
      <h2 style="color:#17202a;">
        ${paymentConfirmed ? "Your tickets are confirmed!" : "Your booking is confirmed!"}
      </h2>

      <p>Hello ${safeCustomerName},</p>

      <p>
        ${paymentConfirmed
          ? "Your payment has been confirmed. Your individual AccessPass tickets are ready."
          : "We've successfully recorded your booking. Please complete payment to activate your tickets."}
      </p>

      <div style="background:#f5f6f8; padding:20px; border-radius:8px;">
        <h3>${safeEventTitle}</h3>
        <p><strong>Venue:</strong> ${safeEventVenue}</p>
        <p><strong>Date:</strong> ${safeEventDate}</p>
        <p><strong>Ticket quantity:</strong> ${Number(booking.quantity)}</p>
        <p><strong>Total:</strong> ₦${Number(booking.totalPrice).toLocaleString("en-GB")}</p>
        <p><strong>Payment status:</strong> ${paymentConfirmed ? "Paid" : "Pending"}</p>
      </div>

      <h3>Your individual tickets</h3>
      ${ticketRows}

      <p style="margin-top:25px;">Thank you for choosing AccessPass.</p>
      <p><strong>The AccessPass Team</strong></p>
    </div>
  `;

  const ticketReferences = (booking.tickets || [])
    .map((ticket) => ticket.ticketCode)
    .join(", ");

  await sendEmail({
    to: booking.user.email,
    subject,
    html,
    text: `Hello ${customerName}, your booking contains ${booking.quantity} individual ticket(s). Ticket references: ${ticketReferences}. Payment status: ${paymentConfirmed ? "Paid" : "Pending"}.`,
    attachments,
  });
};


// Create a booking with individual tickets
const bookEvent = async (req, res) => {
  let reservedEvent = null;
  let quantity = 1;

  try {
    const requestedQuantity = req.body?.quantity ?? 1;

    if (
      (typeof requestedQuantity !== "number" &&
        typeof requestedQuantity !== "string") ||
      (typeof requestedQuantity === "string" &&
        !requestedQuantity.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid ticket quantity.",
      });
    }

    quantity = Number(requestedQuantity);

    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Choose a quantity between 1 and 10.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event reference.",
      });
    }

    reservedEvent = await Event.findOneAndUpdate(
      {
        _id: req.params.eventId,
        ticketsAvailable: { $gte: quantity },
        isCancelled: { $ne: true },
      },
      {
        $inc: { ticketsAvailable: -quantity },
      },
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

    // Generate a separate ticket code and QR code for every ticket
    const tickets = await Promise.all(
      Array.from({ length: quantity }, async () => {
        const ticketCode = generateTicketCode();
        const qrCode = await QRCode.toDataURL(ticketCode);

        return {
          ticketCode,
          qrCode,
          ticketStatus: "active",
          checkedIn: false,
        };
      })
    );

    const booking = await Booking.create({
      user: req.user._id,
      event: reservedEvent._id,
      quantity,
      totalPrice: Number(reservedEvent.price || 0) * quantity,
      tickets,
    });

    try {
      await sendBookingNotification(booking._id, false);
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: `${quantity} individual ticket(s) booked successfully. Payment is pending.`,
      booking,
    });
  } catch (error) {
    if (reservedEvent) {
      await Event.updateOne(
        { _id: reservedEvent._id },
        { $inc: { ticketsAvailable: quantity } }
      ).catch((restoreError) => {
        console.error("Ticket inventory restoration failed:", restoreError);
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A ticket reference collision occurred. Please try again.",
      });
    }

    console.error("Booking error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't complete this booking. Please try again.",
    });
  }
};


// Get bookings belonging to the logged-in user
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title venue date price image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your bookings.",
    });
  }
};


// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title venue date price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
};


// Get one booking
const getBookingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking reference.",
      });
    }

    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this booking.",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load this booking.",
    });
  }
};


// Complete demo payment for a booking
const completeDemoPayment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking reference.",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        paymentStatus: "pending",
      },
      {
        $set: {
          paymentStatus: "paid",
          paymentReference: `DEMO-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
        },
      },
      { new: true }
    ).populate("event", "title venue date price image");

    if (booking) {
      try {
        await sendBookingNotification(booking._id, true);
      } catch (emailError) {
        console.error("Payment confirmation email failed:", emailError);
      }

      return res.status(200).json({
        success: true,
        message: "Demo payment completed successfully.",
        booking,
      });
    }

    const existingBooking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (existingBooking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking has already been paid for.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "This booking cannot be paid for.",
    });
  } catch (error) {
    console.error("Demo payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete demo payment.",
    });
  }
};


// Verify an individual ticket
const verifyTicket = async (req, res) => {
  try {
    const ticketCode = String(req.params.ticketCode || "").toUpperCase();

    const booking = await Booking.findOne({
      "tickets.ticketCode": ticketCode,
    })
      .select("quantity paymentStatus tickets event")
      .populate("event", "title venue date image");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket.",
      });
    }

    const ticket = booking.tickets.find(
      (item) => item.ticketCode === ticketCode
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket.",
      });
    }

    const used = ticket.checkedIn || ticket.ticketStatus === "used";

    const safeBooking = {
      ticketCode: ticket.ticketCode,
      quantity: 1,
      bookingQuantity: booking.quantity,
      paymentStatus: booking.paymentStatus,
      ticketStatus: used ? "used" : ticket.ticketStatus,
      checkedIn: ticket.checkedIn,
      event: booking.event
        ? {
            title: booking.event.title,
            venue: booking.event.venue,
            date: booking.event.date,
            image: booking.event.image,
          }
        : null,
    };

    return res.status(200).json({
      success: true,
      booking: safeBooking,
      ticketStatus: safeBooking.ticketStatus,
      message: used
        ? "This ticket has already been checked in."
        : booking.paymentStatus !== "paid"
          ? "Payment has not been confirmed for this ticket."
          : "Ticket found. Valid for entry.",
    });
  } catch (error) {
    console.error("Ticket verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify ticket at this time.",
    });
  }
};


// Check in one individual ticket
const checkInTicket = async (req, res) => {
  try {
    const ticketCode = String(req.params.ticketCode || "").toUpperCase();

    const booking = await Booking.findOneAndUpdate(
      {
        paymentStatus: "paid",
        tickets: {
          $elemMatch: {
            ticketCode,
            ticketStatus: "active",
            checkedIn: false,
          },
        },
      },
      {
        $set: {
          "tickets.$.checkedIn": true,
          "tickets.$.checkedInAt": new Date(),
          "tickets.$.ticketStatus": "used",
        },
      },
      { new: true }
    )
      .select("quantity paymentStatus tickets event")
      .populate("event", "title venue date image");

    if (booking) {
      const ticket = booking.tickets.find(
        (item) => item.ticketCode === ticketCode
      );

      return res.status(200).json({
        success: true,
        message: "Ticket checked in successfully.",
        booking: {
          ticketCode: ticket.ticketCode,
          ticketStatus: ticket.ticketStatus,
          checkedIn: ticket.checkedIn,
          checkedInAt: ticket.checkedInAt,
          paymentStatus: booking.paymentStatus,
          event: booking.event,
        },
      });
    }

    const existingBooking = await Booking.findOne({
      "tickets.ticketCode": ticketCode,
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    if (existingBooking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment must be confirmed before check-in.",
      });
    }

    return res.status(409).json({
      success: false,
      message: "This ticket has already been checked in or is no longer active.",
    });
  } catch (error) {
    console.error("Ticket check-in error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check in this ticket.",
    });
  }
};


module.exports = {
  bookEvent,
  getMyBookings,
  getAllBookings,
  getBookingById,
  completeDemoPayment,
  verifyTicket,
  checkInTicket,
};
