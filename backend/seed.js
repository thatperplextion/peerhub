const mongoose = require('mongoose');
const User = require('./models/userModel');
const Video = require('./models/videoModel');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Video.deleteMany({});

    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await User.create([
      {
        universityId: 'KLH001',
        email: 'professor@klh.edu.in',
        password: 'password123',
        name: 'Dr. Rajesh Kumar',
        role: 'faculty',
        department: 'Computer Science'
      },
      {
        universityId: 'KLH002',
        email: 'student@klh.edu.in',
        password: 'password123',
        name: 'Amit Sharma',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year'
      }
    ]);

    // Create sample videos
    console.log('🎥 Creating sample videos...');
    const videos = await Video.create([
      {
        title: 'Introduction to Data Structures',
        description: 'Learn about arrays, linked lists, stacks, and queues in this comprehensive introduction.',
        filename: 'data-structures-intro.mp4',
        thumbnail: 'data-structures-thumb.jpg',
        duration: 1200,
        size: 52428800, // 50MB in bytes
        uploader: users[0]._id,
        subject: 'Computer Science',
        topic: 'Data Structures',
        courseCode: 'CS201',
        semester: 'Spring 2024',
        tags: ['programming', 'algorithms', 'data structures'],
        views: 245,
        likes: [],
        processingStatus: 'completed'
      },
      {
        title: 'Calculus I: Limits and Continuity',
        description: 'Understanding the fundamental concepts of limits and continuity in calculus.',
        filename: 'calculus-limits.mp4',
        thumbnail: 'calculus-thumb.jpg',
        duration: 1800,
        size: 73400320, // 70MB
        uploader: users[0]._id,
        subject: 'Mathematics',
        topic: 'Calculus',
        courseCode: 'MATH101',
        semester: 'Fall 2024',
        tags: ['mathematics', 'calculus', 'limits'],
        views: 189,
        likes: [],
        processingStatus: 'completed'
      },
      {
        title: 'Python for Beginners - Part 1',
        description: 'Start your programming journey with Python basics, variables, and data types.',
        filename: 'python-beginners-1.mp4',
        thumbnail: 'python-thumb.jpg',
        duration: 900,
        size: 41943040, // 40MB
        uploader: users[1]._id,
        subject: 'Computer Science',
        topic: 'Programming Fundamentals',
        courseCode: 'CS101',
        semester: 'Spring 2024',
        tags: ['python', 'programming', 'beginners'],
        views: 512,
        likes: [],
        processingStatus: 'completed'
      },
      {
        title: 'Quantum Mechanics Fundamentals',
        description: 'Introduction to wave functions, quantum states, and the Schrödinger equation.',
        filename: 'quantum-mechanics.mp4',
        thumbnail: 'quantum-thumb.jpg',
        duration: 2100,
        size: 94371840, // 90MB
        uploader: users[0]._id,
        subject: 'Physics',
        topic: 'Quantum Mechanics',
        courseCode: 'PHYS301',
        semester: 'Fall 2024',
        tags: ['physics', 'quantum mechanics', 'theory'],
        views: 156,
        likes: [],
        processingStatus: 'completed'
      },
      {
        title: 'Database Design Best Practices',
        description: 'Learn normalization, indexing, and optimization techniques for database design.',
        filename: 'database-design.mp4',
        thumbnail: 'database-thumb.jpg',
        duration: 1500,
        size: 62914560, // 60MB
        uploader: users[0]._id,
        subject: 'Computer Science',
        topic: 'Database Systems',
        courseCode: 'CS301',
        semester: 'Spring 2024',
        tags: ['databases', 'SQL', 'design patterns'],
        views: 324,
        likes: [],
        processingStatus: 'completed'
      }
    ]);

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Created ${users.length} users and ${videos.length} videos`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();