import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const DB_URL =
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_PATH}/${process.env.DATABASE_NAME}`
        : `${process.env.LIVE_PATH}/${process.env.DATABASE_NAME}`;
    const connection = await mongoose.connect(DB_URL);
    console.log(`Connected to database`, connection.connection.host);
  } catch (err: any) {
    console.log(`Can not connect to mongdb`, err);
    process.exit(1);
  }
};
export default connectDB;
