const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

   price: {
  type: Number,
  required: true,
  default: 0,
  min: [0, "Event price cannot be negative."],
},

totalTickets: {
  type: Number,
  required: true,
  min: [1, "An event must have at least one ticket."],
  validate: {
    validator: Number.isInteger,
    message: "Total tickets must be a whole number.",
  },
},

   ticketsAvailable: {
  type: Number,
  required: true,
  min: [0, "Available tickets cannot be negative."],
  validate: {
    validator: Number.isInteger,
    message: "Available tickets must be a whole number.",
  },
},

    image: {
      type: String,
      default: "",
    },

    isCancelled: {
  type: Boolean,
  default: false,
},

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);