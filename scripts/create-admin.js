#!/usr/bin/env node
import { drizzle } from 'drizzle-orm/d1';
import { D1Database$ } from 'cfw-bindings-wrangler-bridge';
import * as schema from '../src/lib/server/db/schema.js';
import { createPasswordHash } from '../src/lib/server/password-hasher.js';

async function createAdminUser() {
  try {
    console.log('🔧 Setting up admin user...');

    // Connect to the local D1 database
    const db = drizzle(new D1Database$('DB'), { schema });

    // Hash the admin password
    console.log('🔒 Hashing password...');
    const hashedPassword = await createPasswordHash('admin123');

    // Check if admin user already exists
    console.log('🔍 Checking if admin user already exists...');
    const existingUser = await db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.username, 'admin'))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Existing admin user:', existingUser[0]);
      return;
    }

    // Insert the admin user
    console.log('➕ Creating admin user...');
    const adminUser = await db
      .insert(schema.userTable)
      .values({
        username: 'admin',
        email: 'admin@rgbunion.local',
        password: hashedPassword,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('📋 User details:', adminUser[0]);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@rgbunion.local');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Import the eq function from drizzle-orm
import { eq } from 'drizzle-orm';

// Run the script
createAdminUser();
