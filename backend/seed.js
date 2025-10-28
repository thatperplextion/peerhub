const mongoose = require('mongoose');
const User = require('./models/User');
const Video = require('./models/Video');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany({});
    await Video.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        universityId: 'KLH001',
        email: 'professor@klh.edu.in',
        password: 'password123',
        name: 'Dr. Rajesh Kumar',
        role: 'faculty',
        department: 'Computer Science',
        avatar: 'https://example.com/avatar1.jpg'
      },
      {
        universityId: 'KLH002',
        email: 'student@klh.edu.in',
        password: 'password123',
        name: 'Amit Sharma',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        avatar: 'https://example.com/avatar2.jpg'
      }
    ]);

    console.log('✅ Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();