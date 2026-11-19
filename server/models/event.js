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
      default: 0,
    },

    totalTickets: {
      type: Number,
      required: true,
    },

    ticketsAvailable: {
      type: Number,
      required: true,
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