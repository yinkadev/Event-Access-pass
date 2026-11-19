const Event = require("../models/event");
const Booking = require("../models/booking");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, price = 0, totalTickets, image = "" } = req.body;
    const ticketCount = Number(totalTickets);
    const ticketPrice = Number(price);
    if (!title?.trim() || !description?.trim() || !venue?.trim() || !date || !Number.isFinite(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: "Title, description, venue and a valid date are required." });
    }
    if (!Number.isSafeInteger(ticketCount) || ticketCount < 1 || !Number.isFinite(ticketPrice) || ticketPrice < 0) {
      return res.status(400).json({ success: false, message: "Enter a valid ticket quantity and a price of zero or more." });
    }
    const event = await Event.create({
      title: title.trim(), description: description.trim(), venue: venue.trim(), date,
      price: ticketPrice, totalTickets: ticketCount, ticketsAvailable: ticketCount,
      image: typeof image === "string" ? image.trim() : "", organizer: req.user._id,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
  const events = await Event.find({
  isCancelled: { $ne: true },
}).populate(
  "organizer",
  "name email"
);

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
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

    const { title, description, venue, date, price, totalTickets, image } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ success: false, message: "Enter a valid event title." });
      }
      event.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ success: false, message: "Enter a valid description." });
      }
      event.description = description.trim();
    }

    if (venue !== undefined) {
      if (typeof venue !== "string" || !venue.trim()) {
        return res.status(400).json({ success: false, message: "Enter a valid venue." });
      }
      event.venue = venue.trim();
    }

    if (date !== undefined) {
      if (!date || !Number.isFinite(new Date(date).getTime())) {
        return res.status(400).json({ success: false, message: "Enter a valid event date." });
      }
      event.date = date;
    }

    if (price !== undefined) {
      const newPrice = Number(price);
      if (!Number.isFinite(newPrice) || newPrice < 0) {
        return res.status(400).json({ success: false, message: "Enter a valid ticket price." });
      }
      event.price = newPrice;
    }

    if (image !== undefined) {
      if (typeof image !== "string") {
        return res.status(400).json({ success: false, message: "Enter a valid image value." });
      }
      event.image = image.trim();
    }

    if (totalTickets !== undefined) {
      const newTotal = Number(totalTickets);
      const soldTickets = event.totalTickets - event.ticketsAvailable;

      if (!Number.isSafeInteger(newTotal) || newTotal < 1) {
        return res.status(400).json({ success: false, message: "Enter a valid ticket quantity." });
      }

      if (newTotal < soldTickets) {
        return res.status(400).json({
          success: false,
          message: `You cannot set total tickets below the ${soldTickets} already sold.`,
        });
      }

      event.totalTickets = newTotal;
      event.ticketsAvailable = newTotal - soldTickets;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update this event.",
    });
  }
};



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
  getEventById,
  updateEvent,
  deleteEvent,
  cancelEvent
};
