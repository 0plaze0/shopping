import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";

//database
connectDB();

//rest object
const app = express();
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//rest api
app.get("/", async (req, res) => {
  return res.status(200).send("hello");
});
//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

//listen
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`server is listenning in PORT ${PORT}`.bgBlue);
  });
});
