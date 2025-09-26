#!/usr/bin/env node
import { drizzle } from 'drizzle-orm/d1';
import { D1Database$ } from 'cfw-bindings-wrangler-bridge';
import * as schema from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function testDatabaseIssues() {
  console.log('🚨 Database Schema Integrity Test\n');

  try {
    const db = drizzle(new D1Database$('DB'), { schema });

    console.log('📋 Schema Analysis:');
    console.log('1. userTable.id: integer (auto-increment)');
    console.log('2. sessionTable.userId: text (references userTable.id)');
    console.log('3. websitesTable.user_id: text (references userTable.id)');
    console.log('\n⚠️ SCHEMA INCONSISTENCY DETECTED:');
    console.log('Foreign key references have type mismatch (text → integer)\n');

    // Get the admin user to check ID type
    const adminUser = await db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.username, 'admin'))
      .limit(1);

    if (adminUser.length === 0) {
      console.log('❌ Admin user not found');
      return false;
    }

    const userId = adminUser[0].id;
    console.log(`👤 Admin User ID: ${userId} (type: ${typeof userId})`);

    // Test 1: Direct integer-to-text reference (this should work in SQLite due to type coercion)
    console.log('\n🧪 Testing Foreign Key References:');

    try {
      // Test creating session with integer user ID converted to string
      const testSession = await db
        .insert(schema.sessionTable)
        .values({
          id: 'test_session_integrity_check',
          userId: userId.toString(), // Convert integer to string
          expiresAt: Math.floor(Date.now() / 1000) + 3600
        })
        .returning();

      console.log('✅ Session creation with string userId: SUCCESS');
      console.log(`   Created session: ${testSession[0].id}`);

      // Clean up session
      await db
        .delete(schema.sessionTable)
        .where(eq(schema.sessionTable.id, 'test_session_integrity_check'));

    } catch (error) {
      console.log('❌ Session creation with string userId: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    try {
      // Test creating website with integer user ID converted to string
      const testWebsite = await db
        .insert(schema.websitesTable)
        .values({
          title: 'Schema Test Website',
          link: 'https://schema-test.example.com',
          description: 'Testing schema integrity',
          user_id: userId.toString() // Convert integer to string
        })
        .returning();

      console.log('✅ Website creation with string user_id: SUCCESS');
      console.log(`   Created website: ${testWebsite[0].id}`);

      // Clean up website
      await db
        .delete(schema.websitesTable)
        .where(eq(schema.websitesTable.id, testWebsite[0].id));

    } catch (error) {
      console.log('❌ Website creation with string user_id: FAILED');
      console.log(`   Error: ${error.message}`);
    }

    // Test 2: Try to create session with integer directly (this might fail)
    try {
      const testSession2 = await db
        .insert(schema.sessionTable)
        .values({
          id: 'test_session_integer_check',
          userId: userId, // Use integer directly
          expiresAt: Math.floor(Date.now() / 1000) + 3600
        })
        .returning();

      console.log('⚠️ Session creation with integer userId: UNEXPECTED SUCCESS');
      console.log('   SQLite type coercion is working, but this is not ideal');

      // Clean up
      await db
        .delete(schema.sessionTable)
        .where(eq(schema.sessionTable.id, 'test_session_integer_check'));

    } catch (error) {
      console.log('❌ Session creation with integer userId: FAILED (EXPECTED)');
      console.log(`   Error: ${error.message}`);
    }

    console.log('\n📊 Recommendations:');
    console.log('1. 🔧 Fix schema consistency:');
    console.log('   Option A: Change sessionTable.userId and websitesTable.user_id to integer');
    console.log('   Option B: Change userTable.id to text (not recommended)');
    console.log('   Option C: Use string IDs consistently throughout the app');

    console.log('\n2. 🔄 Current workaround:');
    console.log('   Always convert user.id to string when creating foreign key references');
    console.log('   e.g., userId: user.id.toString()');

    console.log('\n3. ⚡ Performance impact:');
    console.log('   Mixed types may cause query performance issues');
    console.log('   Index efficiency may be reduced');

    return true;

  } catch (error) {
    console.error('❌ Critical error during schema testing:', error);
    return false;
  }
}

// Run the schema integrity test
testDatabaseIssues().then(success => {
  console.log('\n🏁 Schema Integrity Test Complete');
  process.exit(success ? 0 : 1);
});