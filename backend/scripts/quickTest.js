const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let adminToken = '';
let internToken = '';

const testAPI = async () => {
  try {
    console.log('🔍 Testing Seat Reservation API...\n');

    // Test 1: Server health check
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get(`${BASE_URL}`);
    console.log('✅ Server is running:', healthCheck.data.message);

    // Test 2: Admin login
    console.log('\n2. Testing admin login...');
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@company.com',
      password: '123456'
    });
    adminToken = adminLogin.data.token;
    console.log('✅ Admin logged in successfully');
    console.log('👤 Admin:', adminLogin.data.user.name);

    // Test 3: Get seats
    console.log('\n3. Testing get seats...');
    const seats = await axios.get(`${BASE_URL}/api/seats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${seats.data.length} seats`);

    // Test 4: Intern login
    console.log('\n4. Testing intern login...');
    const internLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'tharuka@company.com',
      password: '123456'
    });
    internToken = internLogin.data.token;
    console.log('✅ Intern logged in successfully');
    console.log('👤 Intern:', internLogin.data.user.name);

    console.log('\n🎉 All tests passed! API is working correctly.');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Server connection');
    console.log('- ✅ Admin authentication');
    console.log('- ✅ Intern authentication');
    console.log('- ✅ Seat retrieval');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAPI();