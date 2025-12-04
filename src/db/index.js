
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const connectDB = async () => {
  try {
    // conneting to mongodb

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\nMONGODB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('ERROR Connection to DATABASE :: ', error);
    process.exit(1);
  }
};

export default connectDB;