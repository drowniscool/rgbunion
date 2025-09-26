#!/usr/bin/env node
import { execSync } from 'child_process';
import { createPasswordHash } from '../src/lib/server/password-hasher.js';

async function createAdminUserProduction() {
  try {
    console.log('🔧 Setting up admin user in PRODUCTION database...');
    console.log('⚠️  WARNING: This will affect your production database!');

    // Hash the admin password
    console.log('🔒 Hashing password...');
    const hashedPassword = await createPasswordHash('admin123');

    // Check if admin user already exists
    console.log('🔍 Checking if admin user already exists in production...');
    
    try {
      const checkResult = execSync(
        `wrangler d1 execute rgbunion --remote --command="SELECT username FROM user WHERE username='admin' LIMIT 1;"`,
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      if (checkResult.includes('admin')) {
        console.log('⚠️  Admin user already exists in production!');
        return;
      }
    } catch (error) {
      console.log('🔍 Proceeding to create admin user...');
    }

    // Insert the admin user
    console.log('➕ Creating admin user in production database...');
    const insertSQL = `INSERT INTO user (username, email, password) VALUES ('admin', 'admin@rgbunion.local', '${hashedPassword}');`;
    
    const result = execSync(
      `wrangler d1 execute rgbunion --remote --command="${insertSQL}"`,
      { encoding: 'utf8', cwd: process.cwd() }
    );

    console.log('✅ Admin user created successfully in PRODUCTION!');
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@rgbunion.local');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user in production:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUserProduction();
