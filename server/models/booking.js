const mongoose = require("mongoose");

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
      default: 1,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    ticketStatus: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },

    ticketCode: {
      type: String,
      unique: true,
      required: true,
    },



    paymentReference: {
  type: String,
  default: null,
},

qrCode: {
  type: String,
  default: null,
},

checkedIn: {
  type: Boolean,
  default: false,
},

checkedInAt: {
  type: Date,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);