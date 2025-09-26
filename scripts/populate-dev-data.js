#!/usr/bin/env node
import { drizzle } from 'drizzle-orm/d1';
import { D1Database$ } from 'cfw-bindings-wrangler-bridge';
import * as schema from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function populateDevDatabase() {
  try {
    console.log('🎯 Populating development database with example data...');

    // Connect to the local D1 database
    const db = drizzle(new D1Database$('DB'), { schema });

    // Get admin user ID (assuming it exists)
    const adminUser = await db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.username, 'admin'))
      .limit(1);

    if (adminUser.length === 0) {
      console.log('❌ Admin user not found. Please run `npm run admin:create` first.');
      process.exit(1);
    }

    const userId = adminUser[0].id.toString();
    console.log(`👤 Using admin user ID: ${userId}`);

    // 1. Create Shop Categories
    console.log('🏪 Creating shop categories...');
    const categories = await db.insert(schema.shopCategoriesTable).values([
      { tag: 'enrolls' },
      { tag: 'fraud-logs' },
      { tag: 'tools' },
      { tag: 'services' }
    ]).returning();

    const enrollsCategory = categories.find(c => c.tag === 'enrolls');
    const fraudLogsCategory = categories.find(c => c.tag === 'fraud-logs');
    const toolsCategory = categories.find(c => c.tag === 'tools');
    const servicesCategory = categories.find(c => c.tag === 'services');

    console.log('✅ Categories created:', categories.map(c => c.tag).join(', '));

    // 2. Create Subcategories
    console.log('📂 Creating subcategories...');
    const subcategories = await db.insert(schema.shopSubcategoriesTable).values([
      // Enrolls subcategories
      { name: 'Fresh Enrolls', category_id: enrollsCategory.id },
      { name: 'Aged Enrolls', category_id: enrollsCategory.id },
      { name: 'Premium Enrolls', category_id: enrollsCategory.id },
      
      // Fraud Logs subcategories
      { name: 'Bank Logs', category_id: fraudLogsCategory.id },
      { name: 'Credit Card Logs', category_id: fraudLogsCategory.id },
      { name: 'PayPal Logs', category_id: fraudLogsCategory.id },
      
      // Tools subcategories
      { name: 'Checkers', category_id: toolsCategory.id },
      { name: 'Generators', category_id: toolsCategory.id },
      
      // Services subcategories
      { name: 'Tutorials', category_id: servicesCategory.id },
      { name: 'Consultations', category_id: servicesCategory.id }
    ]).returning();

    console.log('✅ Subcategories created:', subcategories.length, 'items');

    // 3. Create Shop Items
    console.log('🛍️ Creating shop items...');
    
    // Find subcategory IDs
    const freshEnrolls = subcategories.find(s => s.name === 'Fresh Enrolls');
    const agedEnrolls = subcategories.find(s => s.name === 'Aged Enrolls');
    const premiumEnrolls = subcategories.find(s => s.name === 'Premium Enrolls');
    const bankLogs = subcategories.find(s => s.name === 'Bank Logs');
    const ccLogs = subcategories.find(s => s.name === 'Credit Card Logs');
    const paypalLogs = subcategories.find(s => s.name === 'PayPal Logs');
    const checkers = subcategories.find(s => s.name === 'Checkers');
    const generators = subcategories.find(s => s.name === 'Generators');
    const tutorials = subcategories.find(s => s.name === 'Tutorials');

    const shopItems = await db.insert(schema.shopItemsTable).values([
      // Fresh Enrolls
      { name: 'US Fresh Bank Enrolls - High Balance', price: 250, link: 'https://t.me/rgbunion_shop', category_id: enrollsCategory.id, subcategory_id: freshEnrolls.id },
      { name: 'UK Fresh Credit Enrolls', price: 200, link: 'https://t.me/rgbunion_shop', category_id: enrollsCategory.id, subcategory_id: freshEnrolls.id },
      { name: 'CA Fresh PayPal Enrolls', price: 180, link: 'https://t.me/rgbunion_shop', category_id: enrollsCategory.id, subcategory_id: freshEnrolls.id },
      
      // Aged Enrolls
      { name: 'US Aged Bank Enrolls - 6+ Months', price: 150, link: 'https://t.me/rgbunion_shop', category_id: enrollsCategory.id, subcategory_id: agedEnrolls.id },
      { name: 'EU Aged Business Enrolls', price: 300, link: 'https://t.me/rgbunion_shop', category_id: enrollsCategory.id, subcategory_id: agedEnrolls.id },
      
      // Premium Enrolls
      { name: 'Premium US Bank Enrolls - $50K+ Balance', price: 500, link: 'https://t.me/rgbunion_premium', category_id: enrollsCategory.id, subcategory_id: premiumEnrolls.id },
      { name: 'Premium Business Enrolls - Verified', price: 750, link: 'https://t.me/rgbunion_premium', category_id: enrollsCategory.id, subcategory_id: premiumEnrolls.id },
      
      // Bank Logs
      { name: 'Chase Bank Logs - Fresh', price: 120, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: bankLogs.id },
      { name: 'Wells Fargo Logs - High Balance', price: 150, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: bankLogs.id },
      { name: 'Bank of America Logs', price: 130, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: bankLogs.id },
      
      // Credit Card Logs
      { name: 'Visa Platinum Logs', price: 80, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: ccLogs.id },
      { name: 'Mastercard Gold Logs', price: 75, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: ccLogs.id },
      { name: 'AmEx Black Card Logs', price: 200, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: ccLogs.id },
      
      // PayPal Logs
      { name: 'PayPal Business Logs - Verified', price: 100, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: paypalLogs.id },
      { name: 'PayPal Personal Logs - $5K+ Balance', price: 90, link: 'https://t.me/rgbunion_logs', category_id: fraudLogsCategory.id, subcategory_id: paypalLogs.id },
      
      // Tools
      { name: 'CC Checker Pro - Multi-Gateway', price: 50, link: 'https://t.me/rgbunion_tools', category_id: toolsCategory.id, subcategory_id: checkers.id },
      { name: 'Bank Account Checker', price: 75, link: 'https://t.me/rgbunion_tools', category_id: toolsCategory.id, subcategory_id: checkers.id },
      { name: 'Identity Generator Pro', price: 40, link: 'https://t.me/rgbunion_tools', category_id: toolsCategory.id, subcategory_id: generators.id },
      { name: 'Fullz Generator - US/UK/CA', price: 60, link: 'https://t.me/rgbunion_tools', category_id: toolsCategory.id, subcategory_id: generators.id },
      
      // Services
      { name: 'Cashout Methods Tutorial - Complete Guide', price: 100, link: 'https://t.me/rgbunion_services', category_id: servicesCategory.id, subcategory_id: tutorials.id },
      { name: 'Bank Drop Setup Guide', price: 80, link: 'https://t.me/rgbunion_services', category_id: servicesCategory.id, subcategory_id: tutorials.id }
    ]).returning();

    console.log('✅ Shop items created:', shopItems.length, 'items');

    // 4. Create Website Links (Telegram channels)
    console.log('🔗 Creating RGBUnion Telegram links...');
    const websiteLinks = await db.insert(schema.websitesTable).values([
      {
        title: 'RGBUnion Main Channel',
        link: 'https://t.me/rgbunion_main',
        description: 'Main RGBUnion Telegram channel for announcements, updates, and community discussions.',
        user_id: userId
      },
      {
        title: 'RGBUnion Shop',
        link: 'https://t.me/rgbunion_shop',
        description: 'Official RGBUnion shop for enrolls, logs, and premium services. Trusted vendor since 2020.',
        user_id: userId
      },
      {
        title: 'RGBUnion Premium',
        link: 'https://t.me/rgbunion_premium',
        description: 'Exclusive premium services and high-value enrolls for verified members only.',
        user_id: userId
      },
      {
        title: 'RGBUnion Logs',
        link: 'https://t.me/rgbunion_logs',
        description: 'Fresh bank logs, credit card data, and PayPal accounts. Updated daily with new drops.',
        user_id: userId
      },
      {
        title: 'RGBUnion Tools',
        link: 'https://t.me/rgbunion_tools',
        description: 'Professional tools for checking, generating, and validating various account types.',
        user_id: userId
      },
      {
        title: 'RGBUnion Services',
        link: 'https://t.me/rgbunion_services',
        description: 'Tutorials, guides, and consultation services for advanced cashout methods and techniques.',
        user_id: userId
      },
      {
        title: 'RGBUnion Support',
        link: 'https://t.me/rgbunion_support',
        description: '24/7 customer support for all RGBUnion services. Fast response guaranteed.',
        user_id: userId
      },
      {
        title: 'RGBUnion Reviews',
        link: 'https://t.me/rgbunion_reviews',
        description: 'Customer reviews and testimonials. Real feedback from verified buyers.',
        user_id: userId
      }
    ]).returning();

    console.log('✅ Website links created:', websiteLinks.length, 'links');

    // Summary
    console.log('\n📊 Database Population Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Subcategories: ${subcategories.length}`);
    console.log(`   Shop Items: ${shopItems.length}`);
    console.log(`   Website Links: ${websiteLinks.length}`);
    console.log('\n✅ Development database successfully populated!');
    console.log('\n🚀 You can now:');
    console.log('   - View the shop at: http://localhost:5173/shop');
    console.log('   - Manage items in admin: http://localhost:5173/admin');
    console.log('   - See links on homepage: http://localhost:5173/');

  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  }
}

// Run the population script
populateDevDatabase();