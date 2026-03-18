const axios = require('axios');
(async () => {
  try {
    const login = await axios.post('http://193.122.62.33:8000/api/auth/token', {email: 'testUser1@gmail.com', password: 'test1234567890'});
    const token = login.data.access_token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    console.log('Token acquired.');

    const wh = await axios.get('http://193.122.62.33:8000/api/warehouses/', config).catch(e => e.response);
    console.log('Warehouses Status:', wh?.status);
    console.log('Warehouses Data:', wh?.data);
    
    const v = await axios.get('http://193.122.62.33:8000/api/fleet/vehicles/', config).catch(e => e.response);
    console.log('Vehicles Status:', v?.status);
    console.log('Vehicles Data:', v?.data);
    
    const c = await axios.get('http://193.122.62.33:8000/api/cargo/', config).catch(e => e.response);
    console.log('Cargos Status:', c?.status);
    console.log('Cargos Data:', JSON.stringify(c?.data, null, 2).slice(0, 500) + '...');
  } catch (err) {
    console.error('Error logging in:', err.message);
  }
})();
