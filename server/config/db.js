const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('./seedData');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz_portal';

  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    await seedData();
    return;
  } catch (err) {
    console.warn(`Could not connect to external MongoDB: ${err.message}`);
    console.log('Starting embedded In-Memory MongoDB engine for seamless execution...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
      await seedData();
    } catch (memErr) {
      console.error('Failed to initialize In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
