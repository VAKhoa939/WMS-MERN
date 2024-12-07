import { config } from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import goodsRoutes from "./routes/goodsRoute.js";
import userRoutes from "./routes/userRoute.js";
import addressRoutes from "./routes/addressRoute.js";
import authRoutes from "./routes/authRoute.js";
import importRouter from "./routes/importDBRoute.js";
import exportRouter from "./routes/exportDBRoute.js";
import messageRouter from "./routes/messageRoute.js";

config();
const app = express();
app.use(json());

const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("MongoDB connection string is not defined.");
  process.exit(1);
}

connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  });
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/goods", goodsRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/import", importRouter);
app.use("/api/export", exportRouter);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRouter);

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});
