require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('PORT:', process.env.PORT);