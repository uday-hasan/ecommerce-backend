import { connect } from "mongoose";
import { DB_URL } from "../config/env";
const connectDB = async () => {
  try {
    if (!DB_URL) {
      throw new Error("DB_URL not defined.");
    }
    await connect(DB_URL);
  } catch (error) {
    throw error;
  }
};
export default connectDB;
