const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const token = jwt.sign(
  {userId: 'cml06zann00012h4eo9zo4mbs', email: 'yetis.nagata@gmail.com', role: 'admin'}, 
  process.env.JWT_SECRET, 
  {expiresIn: '7d'}
);

console.log('Token:', token.substring(0, 50) + '...');

axios.get('http://localhost:3001/api/dashboard/usage', {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => {
  console.log('\n📊 Dashboard Usage API:');
  console.log(JSON.stringify(res.data, null, 2));
})
.catch(err => {
  console.error('Error:', err.response?.data || err.message);
});
