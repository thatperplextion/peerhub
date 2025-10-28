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
        uploader: users[0]._id,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360/4A90E2/ffffff?text=Data+Structures',
        category: 'Computer Science',
        subject: 'Data Structures',
        tags: ['programming', 'algorithms', 'data structures'],
        duration: 1200,
        views: 245,
        likes: 42,
        status: 'published'
      },
      {
        title: 'Calculus I: Limits and Continuity',
        description: 'Understanding the fundamental concepts of limits and continuity in calculus.',
        uploader: users[0]._id,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360/E24A90/ffffff?text=Calculus',
        category: 'Mathematics',
        subject: 'Calculus',
        tags: ['mathematics', 'calculus', 'limits'],
        duration: 1800,
        views: 189,
        likes: 35,
        status: 'published'
      },
      {
        title: 'Python for Beginners - Part 1',
        description: 'Start your programming journey with Python basics, variables, and data types.',
        uploader: users[1]._id,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360/90E24A/ffffff?text=Python+Basics',
        category: 'Computer Science',
        subject: 'Programming',
        tags: ['python', 'programming', 'beginners'],
        duration: 900,
        views: 512,
        likes: 87,
        status: 'published'
      },
      {
        title: 'Quantum Mechanics Fundamentals',
        description: 'Introduction to wave functions, quantum states, and the Schrödinger equation.',
        uploader: users[0]._id,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360/E2904A/ffffff?text=Quantum+Physics',
        category: 'Physics',
        subject: 'Quantum Mechanics',
        tags: ['physics', 'quantum mechanics', 'theory'],
        duration: 2100,
        views: 156,
        likes: 28,
        status: 'published'
      },
      {
        title: 'Database Design Best Practices',
        description: 'Learn normalization, indexing, and optimization techniques for database design.',
        uploader: users[0]._id,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360/4AE290/ffffff?text=Database+Design',
        category: 'Computer Science',
        subject: 'Databases',
        tags: ['databases', 'SQL', 'design patterns'],
        duration: 1500,
        views: 324,
        likes: 61,
        status: 'published'
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