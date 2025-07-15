/**
 * Server startup script with environment variable preprocessing
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load and clean environment variables
function loadAndCleanEnv(): void {
  // Load environment variables
  dotenv.config();

  // Check if DATABASE_URL exists
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL found in environment');
    
    // Check for and fix line breaks in the URL
    if (process.env.DATABASE_URL.includes('\n') || process.env.DATABASE_URL.includes('\r')) {
      console.log('Fixing line breaks in DATABASE_URL');
      process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/\s+/g, '');
    }
  } else {
    console.error('WARNING: DATABASE_URL is not defined in environment variables');
  }

  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
}

// Main function
function main(): void {
  try {
    // Load environment with preprocessing
    loadAndCleanEnv();
    
    // Start the server
    console.log('Starting server with ts-node...');
    require('ts-node/register');
    require('./src/server.ts');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to start server:', error);
    }
    process.exit(1);
  }
}

// Run the main function
main(); 