
const mongoose = require("mongoose");

const individualTicketSchema = new mongoose.Schema(
  {
    ticketCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [
        /^ACP-[A-F0-9]{10}$/,
        "Invalid AccessPass ticket code.",
      ],
    },

    qrCode: {
      type: String,
      default: null,
    },

    ticketStatus: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
      validate: {
        validator: Number.isSafeInteger,
        message: "Ticket quantity must be a whole number.",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Booking total cannot be negative."],
      validate: {
        validator: Number.isFinite,
        message: "Booking total must be a valid number.",
      },
    },

    tickets: {
      type: [individualTicketSchema],
      validate: {
        validator: function (tickets) {
          return tickets.length === this.quantity;
        },
        message: "The number of individual tickets must match the booking quantity.",
      },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentReference: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
