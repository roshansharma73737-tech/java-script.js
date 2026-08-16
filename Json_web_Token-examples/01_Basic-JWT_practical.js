const jwt = require('jsonwebtoken');
 
// In real apps this comes from an environment variable, NEVER hardcoded.
const SECRET_KEY = 'my-super-secret-key-for-demo-only';
 
console.log('--- STEP 1: SIGN (create) a token ---');
const payload = {
  userId: 42,
  username: 'aisha',
  role: 'user',
};
 
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
console.log('Generated JWT:\n', token);
 
console.log('\n--- STEP 2: Inspect the 3 parts ---');
const [header, body, signature] = token.split('.');
console.log('Header (base64):   ', header);
console.log('Payload (base64):  ', body);
console.log('Signature:         ', signature);
 
console.log('\nDecoded header: ', JSON.parse(Buffer.from(header, 'base64').toString()));
console.log('Decoded payload:', JSON.parse(Buffer.from(body, 'base64').toString()));
 
console.log('\n--- STEP 3: VERIFY the token (server side) ---');
try {
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log('Token is VALID. Decoded data:', decoded);
} catch (err) {
  console.log('Token is INVALID:', err.message);
}
 
console.log('\n--- STEP 4: Prove tampering is detected ---');
// An attacker changes one character in the payload section
const tamperedToken = token.slice(0, -5) + 'AAAAA';
try {
  jwt.verify(tamperedToken, SECRET_KEY);
  console.log('Tampered token accepted (this should never happen!)');
} catch (err) {
  console.log('Tampered token REJECTED as expected:', err.message);
}
 
console.log('\n--- STEP 5: Prove expiration is enforced ---');
const shortLivedToken = jwt.sign({ userId: 1 }, SECRET_KEY, { expiresIn: '1s' });
setTimeout(() => {
  try {
    jwt.verify(shortLivedToken, SECRET_KEY);
    console.log('Expired token accepted (should not happen)');
  } catch (err) {
    console.log('Expired token REJECTED as expected:', err.message);
  }
}, 1500);
