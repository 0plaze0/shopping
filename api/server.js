import "dotenv/config";
import express from "express";
import colors from "colors";

const app = express();
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  return res.status(200).send("hello");
});

app.listen(PORT, () => {
  console.log(`server is listenning in PORT ${PORT}`.bgBlue);
});
