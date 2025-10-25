// Test script to verify Eventbrite API token
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testEventbriteAPI() {
  const token = process.env.VITE_EVENTBRITE_API_TOKEN;
  
  console.log('🔍 Testing Eventbrite API...');
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('Token preview:', token ? token.substring(0, 10) + '...' : 'none');
  
  if (!token || token === 'your_eventbrite_api_token_here') {
    console.error('❌ Please set your real Eventbrite API token in .env.local');
    return;
  }
  
  try {
    // Test the API
    const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        'location.address': 'Singapore',
        'location.within': '25km',
        'expand': 'venue,ticket_availability,category',
        'status': 'live',
        'order_by': 'start_asc',
        'page_size': 5
      }
    });
    
    console.log('✅ API Success!');
    console.log('Events found:', response.data.events?.length || 0);
    if (response.data.events?.length > 0) {
      console.log('First event:', response.data.events[0].name?.text);
    }
  } catch (error) {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
  }
}

testEventbriteAPI();
