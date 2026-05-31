import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb+srv://greenleaf_dev_user:43bXacJ4atD65ek2@cluster0.niaur5h.mongodb.net/greenleaf-dev';

async function test() {
  try {
    console.log('Testing connection to:', uri.replace(/:.*@/, ':*****@'));
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ CONNECTED OK — host:', mongoose.connection.host);
    console.log('   DB:', mongoose.connection.name);
    await mongoose.disconnect();
  } catch (e) {
    console.log('❌ Connection FAILED:', e.message);
    console.log('   Code:', e.code);
  }
}

test();
