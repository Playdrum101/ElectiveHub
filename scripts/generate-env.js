// Quick script to help generate a JWT secret
const crypto = require('crypto');

// Generate a random 32-character string
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n🎉 Generated JWT Secret:\n');
console.log(jwtSecret);
console.log('\n✅ Copy this and use it in your .env file as JWT_SECRET=\n');

