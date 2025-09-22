import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import DbConnect from "./lib/db.js";
import userRoutes from "./routes/user.routes.js";
import lectureRoutes from "./routes/lecture.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/user", userRoutes);
app.use("/api/lectures", lectureRoutes);

DbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
});
