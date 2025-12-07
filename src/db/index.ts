// connectDB.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Db } from 'mongodb';

dotenv.config();

let db: Db | null = null;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI!);

    db = connectionInstance.connection.db ?? null; // <-- raw MongoDB DB instance

    console.log(
      `\nMONGODB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`
    );

    return db; // return db so other files can use it
  } catch (error) {
    console.error('ERROR Connection to DATABASE :: ', error);
    process.exit(1);
  }
};

export const getCollection = (name: string) => {
  if (!db) throw new Error('❌ DB not initialized. Call connectDB() first.');
  return db.collection(name); // <-- return MongoDB collection
};

export default connectDB;
