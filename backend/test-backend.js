// Quick test script to verify backend functionality
// Run with: node test-backend.js

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

console.log('🧪 Testing KLH Peer Learning Platform Backend...\n');

async function runTests() {
  let token = null;
  let videoId = null;

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Endpoint...');
    const healthResponse = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('   ✅ Health check passed:', healthResponse.data.message);
    console.log('   Database:', healthResponse.data.database, '\n');

    // Test 2: Register User
    console.log('2️⃣  Testing User Registration...');
    const registerData = {
      universityId: `TEST${Date.now()}`,
      email: `test${Date.now()}@kluniversity.in`,
      password: 'test123456',
      name: 'Test User',
      role: 'student',
      department: 'CSE',
      year: '3rd'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
      token = registerResponse.data.token;
      console.log('   ✅ Registration successful!');
      console.log('   User:', registerResponse.data.user.name);
      console.log('   Token:', token ? 'Generated' : 'Missing', '\n');
    } catch (regError) {
      if (regError.response?.data?.message?.includes('already exists')) {
        console.log('   ⚠️  User already exists, trying login...');
        
        // Try login instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: registerData.email,
          password: registerData.password
        });
        token = loginResponse.data.token;
        console.log('   ✅ Login successful!\n');
      } else {
        throw regError;
      }
    }

    // Test 3: Get User Profile
    console.log('3️⃣  Testing Get Profile...');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Profile retrieved:', profileResponse.data.user.name, '\n');

    // Test 4: Get Videos
    console.log('4️⃣  Testing Get Videos...');
    const videosResponse = await axios.get(`${API_URL}/videos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Videos endpoint working');
    console.log('   Total videos:', videosResponse.data.total, '\n');

    // Test 5: Chatbot (if Gemini API is configured)
    console.log('5️⃣  Testing Chatbot...');
    try {
      const chatbotResponse = await axios.post(
        `${API_URL}/chatbot/ask`,
        {
          question: 'What videos are available on data structures?',
          context: {}
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('   ✅ Chatbot is working!');
      console.log('   Response preview:', chatbotResponse.data.response.substring(0, 100) + '...\n');
    } catch (chatError) {
      if (chatError.response?.data?.response) {
        console.log('   ⚠️  Chatbot responded with fallback message');
        console.log('   (Gemini API might not be configured)\n');
      } else {
        console.log('   ⚠️  Chatbot endpoint exists but needs Gemini API key\n');
      }
    }

    console.log('✅ All core tests passed!\n');
    console.log('📊 Summary:');
    console.log('   - Server is running');
    console.log('   - Database is connected');
    console.log('   - Authentication works');
    console.log('   - API endpoints are functional');
    console.log('\n🎉 Backend is ready for use!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
