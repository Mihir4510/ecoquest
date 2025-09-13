import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI from .env:", process.env.MONGO_URI); // Debug log

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
