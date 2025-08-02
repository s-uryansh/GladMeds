import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
export async function createConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log('MySQL DB connected');
  return connection;
}

const MONGO_URI = process.env.MONGODB_URI!;

type MongooseGlobal = {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached = (global as typeof globalThis & MongooseGlobal).mongoose;

if (!cached) {
  cached = ((global as typeof globalThis & MongooseGlobal).mongoose = { conn: null, promise: null });
}

export async function dbConnect() {
  if (!cached) return null;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: 'GladMeds',
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('MongoDB connected');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
