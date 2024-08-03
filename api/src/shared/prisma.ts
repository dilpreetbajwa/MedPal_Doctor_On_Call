import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose.set("strictQuery", true);

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log("Connected to mongoDB!");
    } catch (error) {
      console.log(error);
    }
  };

  connect();
export default connect;