const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const goodsRoutes = require("./routes/goodsRoute");
const userRoutes = require("./routes/userRoute");
const addressRoutes = require("./routes/addressRoute");
const authRoutes = require("./routes/authRoute");
const importRouter = require("./routes/importDB.Route");
const exportRouter = require("./routes/exportDB.Route");
const messageRouter = require("./routes/messageRoute");

dotenv.config();
const app = express();
app.use(express.json());

const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("MongoDB connection string is not defined.");
  process.exit(1);
}

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  });
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});
