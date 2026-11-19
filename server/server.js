const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./configs/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.get("/", (req, res) => res.json({ success: true, message: "AccessPass API is running." }));
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "API route not found." }));
app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : "An unexpected server error occurred." });
});

const PORT = process.env.PORT || 2000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`AccessPass API listening on port ${PORT}`));
}).catch((error) => {
  console.error("Could not start AccessPass API:", error);
  process.exit(1);
});
