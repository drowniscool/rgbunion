#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read the .env.production file
const envFile = readFileSync(resolve('.env.production'), 'utf8');

// Parse environment variables
const envVars = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

// Set environment variables and run drizzle-kit studio
Object.assign(process.env, envVars);

// Run drizzle-kit studio
execSync('npx drizzle-kit studio', { stdio: 'inherit' });
