const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing MongoDB Connection...');
console.log('Connection string present:', !!process.env.MONGODB_URI);

// Simple test without database name first
const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🎉 MongoDB shit is working!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:');
    console.log('Error:', error.message);
    console.log('💡 Check:');
    console.log('   1. Password in .env file');
    console.log('   2. Network Access in MongoDB Atlas');
    console.log('   3. Database user exists');
    process.exit(1);
  }
};

testConnection();