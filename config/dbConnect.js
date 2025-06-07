import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database conneted"));
    await mongoose.connect(`${process.env.DATABASE_URL}/EcoClean`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
