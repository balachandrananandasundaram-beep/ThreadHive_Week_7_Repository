import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import threadRoutes from "./routes/threads.js";
import subredditRoutes from "./routes/subreddits.js";
import auth from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import voteRoutes from "./routes/votes.js";
import errorHandler from "./middleware/errorHandler.js";

import "./models/Thread.js";
import "./models/Subreddit.js";
import "./models/User.js";

const app = express();

// 1. CORS FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 2. Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 3. Helmet AFTER CORS, with CORP disabled
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// 4. Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use(limiter);

// 5. Routes
app.use("/api/threads", threadRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/auth", auth);
app.use("/api/comments", commentRoutes);
app.use("/api", voteRoutes);

// 6. Error handler
app.use(errorHandler);

export default app;

