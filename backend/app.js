const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const instituteRoutes = require("./routes/institue.routes");
const userRoutes = require("./routes/user.routes");
const paymentRoutes = require("./routes/payment.routes");
const { StripeWebhooks } = require("./controllers/stripeWebhooks.controller");

const app = express();

app.post("/stripe", express.raw({ type: "application/json" }), StripeWebhooks);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, 
  })
);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => res.json({ status: "ok", service: "EduFinder API", version: "2.0.0" }));
app.get("/health", (req, res) => res.json({ status: "healthy", timestamp: new Date().toISOString() }));

app.use("/auth", authRoutes);
app.use("/institutes", instituteRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = app;
