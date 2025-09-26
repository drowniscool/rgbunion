#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

async function populateDevDatabase() {
  try {
    console.log('🎯 Populating development database with example data using direct SQL...');

    // First check if admin user exists
    console.log('👤 Checking admin user...');
    try {
      const checkResult = execSync(
        `wrangler d1 execute rgbunion --local --command="SELECT id FROM user WHERE username='admin' LIMIT 1;"`,
        { encoding: 'utf8' }
      );
      
      if (!checkResult.includes('1')) {
        console.log('❌ Admin user not found. Please run `npm run admin:create` first.');
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ Error checking admin user:', error.message);
      console.log('Please ensure the database is migrated and admin user exists.');
      process.exit(1);
    }

    console.log('✅ Admin user found');

    // Create shop categories
    console.log('🏪 Creating shop categories...');
    const categoriesSQL = `
      INSERT INTO shop_categories (tag) VALUES 
        ('enrolls'),
        ('fraud-logs'),
        ('tools'),
        ('services');
    `;
    
    try {
      execSync(`wrangler d1 execute rgbunion --local --command="${categoriesSQL}"`, { encoding: 'utf8' });
      console.log('✅ Categories created');
    } catch (error) {
      if (!error.message.includes('UNIQUE constraint failed')) {
        console.log('❌ Error creating categories:', error.message);
        process.exit(1);
      }
      console.log('⚠️ Categories already exist, skipping...');
    }

    // Get category IDs
    const getCategoriesResult = execSync(
      `wrangler d1 execute rgbunion --local --command="SELECT id, tag FROM shop_categories;"`,
      { encoding: 'utf8' }
    );

    // Parse the JSON output from Wrangler
    const jsonMatch = getCategoriesResult.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('❌ Could not parse categories JSON output');
      process.exit(1);
    }

    const categoriesData = JSON.parse(jsonMatch[0]);
    const categories = categoriesData[0].results;

    const enrollsCategory = categories.find(c => c.tag === 'enrolls');
    const fraudLogsCategory = categories.find(c => c.tag === 'fraud-logs');
    const toolsCategory = categories.find(c => c.tag === 'tools');
    const servicesCategory = categories.find(c => c.tag === 'services');

    if (!enrollsCategory || !fraudLogsCategory || !toolsCategory || !servicesCategory) {
      console.log('❌ Could not find all categories');
      process.exit(1);
    }

    const enrollsCatId = enrollsCategory.id;
    const fraudLogsCatId = fraudLogsCategory.id;
    const toolsCatId = toolsCategory.id;
    const servicesCatId = servicesCategory.id;

    console.log(`📋 Category IDs: enrolls=${enrollsCatId}, fraud-logs=${fraudLogsCatId}, tools=${toolsCatId}, services=${servicesCatId}`);

    // Create subcategories
    console.log('📂 Creating subcategories...');
    const subcategoriesSQL = `
      INSERT INTO shop_subcategories (name, category_id) VALUES 
        ('Fresh Enrolls', ${enrollsCatId}),
        ('Aged Enrolls', ${enrollsCatId}),
        ('Premium Enrolls', ${enrollsCatId}),
        ('Bank Logs', ${fraudLogsCatId}),
        ('Credit Card Logs', ${fraudLogsCatId}),
        ('PayPal Logs', ${fraudLogsCatId}),
        ('Checkers', ${toolsCatId}),
        ('Generators', ${toolsCatId}),
        ('Tutorials', ${servicesCatId}),
        ('Consultations', ${servicesCatId});
    `;

    try {
      execSync(`wrangler d1 execute rgbunion --local --command="${subcategoriesSQL}"`, { encoding: 'utf8' });
      console.log('✅ Subcategories created');
    } catch (error) {
      if (!error.message.includes('UNIQUE constraint failed')) {
        console.log('❌ Error creating subcategories:', error.message);
        process.exit(1);
      }
      console.log('⚠️ Some subcategories already exist, continuing...');
    }

    // Get subcategory IDs  
    const getSubcategoriesResult = execSync(
      `wrangler d1 execute rgbunion --local --command="SELECT id, name FROM shop_subcategories;"`,
      { encoding: 'utf8' }
    );

    // Create shop items - batch insert
    console.log('🛍️ Creating shop items...');
    const itemsSQL = `
      INSERT INTO shop_items (name, price, link, category_id, subcategory_id) VALUES 
        ('US Fresh Bank Enrolls - High Balance', 250, 'https://t.me/rgbunion_shop', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Fresh Enrolls' LIMIT 1)),
        ('UK Fresh Credit Enrolls', 200, 'https://t.me/rgbunion_shop', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Fresh Enrolls' LIMIT 1)),
        ('CA Fresh PayPal Enrolls', 180, 'https://t.me/rgbunion_shop', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Fresh Enrolls' LIMIT 1)),
        ('US Aged Bank Enrolls - 6+ Months', 150, 'https://t.me/rgbunion_shop', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Aged Enrolls' LIMIT 1)),
        ('EU Aged Business Enrolls', 300, 'https://t.me/rgbunion_shop', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Aged Enrolls' LIMIT 1)),
        ('Premium US Bank Enrolls - $50K+ Balance', 500, 'https://t.me/rgbunion_premium', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Premium Enrolls' LIMIT 1)),
        ('Premium Business Enrolls - Verified', 750, 'https://t.me/rgbunion_premium', ${enrollsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Premium Enrolls' LIMIT 1)),
        ('Chase Bank Logs - Fresh', 120, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Bank Logs' LIMIT 1)),
        ('Wells Fargo Logs - High Balance', 150, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Bank Logs' LIMIT 1)),
        ('Bank of America Logs', 130, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Bank Logs' LIMIT 1)),
        ('Visa Platinum Logs', 80, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Credit Card Logs' LIMIT 1)),
        ('Mastercard Gold Logs', 75, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Credit Card Logs' LIMIT 1)),
        ('AmEx Black Card Logs', 200, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Credit Card Logs' LIMIT 1)),
        ('PayPal Business Logs - Verified', 100, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'PayPal Logs' LIMIT 1)),
        ('PayPal Personal Logs - $5K+ Balance', 90, 'https://t.me/rgbunion_logs', ${fraudLogsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'PayPal Logs' LIMIT 1)),
        ('CC Checker Pro - Multi-Gateway', 50, 'https://t.me/rgbunion_tools', ${toolsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Checkers' LIMIT 1)),
        ('Bank Account Checker', 75, 'https://t.me/rgbunion_tools', ${toolsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Checkers' LIMIT 1)),
        ('Identity Generator Pro', 40, 'https://t.me/rgbunion_tools', ${toolsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Generators' LIMIT 1)),
        ('Fullz Generator - US/UK/CA', 60, 'https://t.me/rgbunion_tools', ${toolsCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Generators' LIMIT 1)),
        ('Cashout Methods Tutorial - Complete Guide', 100, 'https://t.me/rgbunion_services', ${servicesCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Tutorials' LIMIT 1)),
        ('Bank Drop Setup Guide', 80, 'https://t.me/rgbunion_services', ${servicesCatId}, (SELECT id FROM shop_subcategories WHERE name = 'Tutorials' LIMIT 1));
    `;

    try {
      execSync(`wrangler d1 execute rgbunion --local --command="${itemsSQL}"`, { encoding: 'utf8' });
      console.log('✅ Shop items created');
    } catch (error) {
      console.log('⚠️ Some items might already exist:', error.message);
    }

    // Create website links
    console.log('🔗 Creating RGBUnion Telegram links...');
    const linksSQL = `
      INSERT INTO websites (title, link, description, user_id) VALUES 
        ('RGBUnion Main Channel', 'https://t.me/rgbunion_main', 'Main RGBUnion Telegram channel for announcements, updates, and community discussions.', '1'),
        ('RGBUnion Shop', 'https://t.me/rgbunion_shop', 'Official RGBUnion shop for enrolls, logs, and premium services. Trusted vendor since 2020.', '1'),
        ('RGBUnion Premium', 'https://t.me/rgbunion_premium', 'Exclusive premium services and high-value enrolls for verified members only.', '1'),
        ('RGBUnion Logs', 'https://t.me/rgbunion_logs', 'Fresh bank logs, credit card data, and PayPal accounts. Updated daily with new drops.', '1'),
        ('RGBUnion Tools', 'https://t.me/rgbunion_tools', 'Professional tools for checking, generating, and validating various account types.', '1'),
        ('RGBUnion Services', 'https://t.me/rgbunion_services', 'Tutorials, guides, and consultation services for advanced cashout methods and techniques.', '1'),
        ('RGBUnion Support', 'https://t.me/rgbunion_support', '24/7 customer support for all RGBUnion services. Fast response guaranteed.', '1'),
        ('RGBUnion Reviews', 'https://t.me/rgbunion_reviews', 'Customer reviews and testimonials. Real feedback from verified buyers.', '1');
    `;

    try {
      execSync(`wrangler d1 execute rgbunion --local --command="${linksSQL}"`, { encoding: 'utf8' });
      console.log('✅ Website links created');
    } catch (error) {
      console.log('⚠️ Some links might already exist:', error.message);
    }

    // Get counts
    const getCounts = (table) => {
      try {
        const result = execSync(`wrangler d1 execute rgbunion --local --command="SELECT COUNT(*) as count FROM ${table};"`, { encoding: 'utf8' });
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          return data[0].results[0].count.toString();
        }
        return '0';
      } catch {
        return '0';
      }
    };

    const categoriesCount = getCounts('shop_categories');
    const subcategoriesCount = getCounts('shop_subcategories');
    const itemsCount = getCounts('shop_items');
    const linksCount = getCounts('websites');

    // Summary
    console.log('\n📊 Database Population Summary:');
    console.log(`   Categories: ${categoriesCount}`);
    console.log(`   Subcategories: ${subcategoriesCount}`);
    console.log(`   Shop Items: ${itemsCount}`);
    console.log(`   Website Links: ${linksCount}`);
    console.log('\n✅ Development database successfully populated!');
    console.log('\n🚀 You can now:');
    console.log('   - View the shop at: http://localhost:5173/shop');
    console.log('   - Manage items in admin: http://localhost:5173/admin');
    console.log('   - See links on homepage: http://localhost:5173/');

  } catch (error) {
    console.error('❌ Error populating database:', error.message);
    process.exit(1);
  }
}

// Run the population script
populateDevDatabase();