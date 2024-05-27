import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DEV_DB);
    console.log(
      `Connected to Mongoodb Database ${connect.connection.host}`.bgMagenta
    );
  } catch (err) {
    console.log(`Error while connecting to DB\n${err}`.bgRed);
  }
};
