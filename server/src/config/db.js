import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

const isPlaceholderMongoUri = (value) => {
  if (!value) return true;
  return value.includes('<db_username>') || value.includes('<db_password>');
};

const connectDB = async () => {
  const configuredUri = process.env.MONGO_URI?.trim();

  try {
    if (!configuredUri || isPlaceholderMongoUri(configuredUri)) {
      if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create();
      }

      const conn = await mongoose.connect(memoryServer.getUri());
      console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
      return conn;
    }

    const conn = await mongoose.connect(configuredUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (!configuredUri || isPlaceholderMongoUri(configuredUri)) {
      try {
        if (!memoryServer) {
          memoryServer = await MongoMemoryServer.create();
        }

        const conn = await mongoose.connect(memoryServer.getUri());
        console.log(`MongoDB Memory Server Connected (fallback): ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`Database connection error: ${fallbackError.message}`);
        process.exit(1);
      }
    }

    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
