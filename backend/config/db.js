import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️  MONGO_URI not set. MongoDB features unavailable.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      // bufferTimeoutMS: 1000 makes queued operations fail in 1s if MongoDB
      // is not yet connected — so all endpoints respond instantly even
      // while Atlas DNS lookup is still in progress.
      bufferTimeoutMS: 1000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.warn('   Server running. Commodity data: Greenleaf API.');
    console.warn('   Marketplace/Weather/Alerts need MongoDB — seed locally when connected.');
    // DO NOT process.exit(1)
  }
};

export const getIsConnected = () => isConnected;

export default connectDB;
