import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import colors from "colors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

//database
connectDB();

//rest object
const app = express();
const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(morgan("dev"));

//rest api
app.get("/", async (req, res) => {
  return res.status(200).send("hello");
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`server is listenning in PORT ${PORT}`.bgBlue);
  });
});
