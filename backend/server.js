import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import journalRouter from "./routes/journalRoutes.js"; 
import quotesRouter from "./routes/quotesRoutes.js"; 
import gratitudeRouter from "./routes/gratitudeRoutes.js"; 

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://safe-space-5cju.vercel.app',
  // Add any other origins you want to allow
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Preflight requests handling for all routes
app.options('*', cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use("/api/user", userRouter);
app.use("/api/journal", journalRouter); 
app.use("/api/quotes", quotesRouter);
app.use("/api/gratitude", gratitudeRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});