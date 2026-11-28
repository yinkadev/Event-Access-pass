
const Event = require("../models/event");
const Booking = require("../models/booking");
const mongoose = require("mongoose");

// Validate ticket prices, including free events (price = 0)
const isValidPrice = (value) => {
  if (typeof value !== "number" && typeof value !== "string") {
    return false;
  }

  if (typeof value === "string" && !value.trim()) {
    return false;
  }

  const numericPrice = Number(value);

  return Number.isFinite(numericPrice) && numericPrice >= 0;
};

// Validate ticket quantities
const isValidTicketCount = (value) => {
  if (
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    return false;
  }

  if (typeof value === "string" && !value.trim()) {
    return false;
  }

  return Number.isSafeInteger(Number(value)) && Number(value) >= 1;
};

// Validate event dates
const isValidDate = (value) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    Number.isFinite(Date.parse(value))
  );
};

// Validate event text fields
const isValidText = (value, maxLength) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
};

// Validate event image input
const isValidImage = (value) => {
  return (
    typeof value === "string" &&
    value.length <= 1000000
  );
};


// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      venue,
      date,
      price = 0,
      totalTickets,
      image = "",
    } = req.body || {};

    if (
      !isValidText(title, 120) ||
      !isValidText(description, 5000) ||
      !isValidText(venue, 200) ||
      !isValidDate(date)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid title, description, venue and event date.",
      });
    }

    if (
      !isValidTicketCount(totalTickets) ||
      !isValidPrice(price)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid ticket quantity and a price of zero or more.",
      });
    }

    if (!isValidImage(image)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid event image.",
      });
    }

    const ticketCount = Number(totalTickets);
    const ticketPrice = Number(price);

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      venue: venue.trim(),
      date: new Date(date),
      price: ticketPrice,
      totalTickets: ticketCount,
      ticketsAvailable: ticketCount,
      image: image.trim(),
      organizer: req.user._id,
    });

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please check the event details and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create this event.",
    });
  }
};


// GET PUBLIC EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isCancelled: { $ne: true },
    })
      .populate("organizer", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load events.",
    });
  }
};


// GET ALL EVENTS FOR ADMIN
const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get admin events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load events.",
    });
  }
};


// GET SINGLE EVENT
const getEventById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event reference.",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load this event.",
    });
  }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event reference.",
      });
    }

    const updates = req.body || {};
    const allowedFields = [
      "title",
      "description",
      "venue",
      "date",
      "price",
      "totalTickets",
      "image",
    ];

    const submittedFields = Object.keys(updates);

    if (
      submittedFields.length === 0 ||
      submittedFields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event details to update.",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const updateData = {};

    if (updates.title !== undefined) {
      if (!isValidText(updates.title, 120)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid event title (maximum 120 characters).",
        });
      }

      updateData.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (!isValidText(updates.description, 5000)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid description (maximum 5000 characters).",
        });
      }

      updateData.description = updates.description.trim();
    }

    if (updates.venue !== undefined) {
      if (!isValidText(updates.venue, 200)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid venue (maximum 200 characters).",
        });
      }

      updateData.venue = updates.venue.trim();
    }

    if (updates.date !== undefined) {
      if (!isValidDate(updates.date)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid event date.",
        });
      }

      updateData.date = new Date(updates.date);
    }

    if (updates.price !== undefined) {
      if (!isValidPrice(updates.price)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid ticket price.",
        });
      }

      updateData.price = Number(updates.price);
    }

    if (updates.image !== undefined) {
      if (!isValidImage(updates.image)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid event image.",
        });
      }

      updateData.image = updates.image.trim();
    }

    // Handle ticket capacity changes safely
    if (updates.totalTickets !== undefined) {
      if (!isValidTicketCount(updates.totalTickets)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid ticket quantity.",
        });
      }

      const newTotal = Number(updates.totalTickets);
      const soldTickets = event.totalTickets - event.ticketsAvailable;

      if (newTotal < soldTickets) {
        return res.status(400).json({
          success: false,
          message: `You cannot set total tickets below the ${soldTickets} already sold.`,
        });
      }

      updateData.totalTickets = newTotal;
      updateData.ticketsAvailable = newTotal - soldTickets;
    }

    // Match the inventory values we originally read.
    // If a booking changes inventory at the same time,
    // this update will fail instead of overwriting that booking.
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        totalTickets: event.totalTickets,
        ticketsAvailable: event.ticketsAvailable,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return res.status(409).json({
        success: false,
        message: "The event inventory has changed. Please refresh the event and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please check the event details and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update this event.",
    });
  }
};


// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event reference.",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const hasBookings = await Booking.exists({
      event: event._id,
    });

    if (hasBookings) {
      return res.status(409).json({
        success: false,
        message: "This event has bookings. Cancel it instead to preserve ticket records.",
      });
    }

    await Event.findByIdAndDelete(event._id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete this event.",
    });
  }
};


// CANCEL EVENT
const cancelEvent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event reference.",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (event.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "This event has already been cancelled.",
      });
    }

    event.isCancelled = true;
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event cancelled successfully.",
      event,
    });
  } catch (error) {
    console.error("Cancel event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel this event.",
    });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getAdminEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  cancelEvent,
};
