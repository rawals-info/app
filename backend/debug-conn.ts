import dotenv from 'dotenv';

dotenv.config();

console.log('=== DEBUG CONNECTION INFO ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('Raw DATABASE_URL:', process.env.DATABASE_URL);

// Get the cleaned URL
const cleanUrl = process.env.DATABASE_URL?.replace(/\s+/g, '') || '';
console.log('Cleaned URL:', cleanUrl);

// Parse the URL
try {
  const url = new URL(cleanUrl);
  console.log('URL object:');
  console.log('  protocol:', url.protocol);
  console.log('  username:', url.username);
  console.log('  password:', url.password ? '***' : 'none');
  console.log('  hostname:', url.hostname);
  console.log('  port:', url.port);
  console.log('  pathname:', url.pathname);
  console.log('  search:', url.search);
} catch (err) {
  if (err instanceof Error) {
    console.log('Failed to parse URL:', err.message);
  }
} 