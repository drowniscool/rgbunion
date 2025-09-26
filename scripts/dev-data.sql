-- Shop Categories
INSERT OR IGNORE INTO shop_categories (tag) VALUES 
  ('enrolls'),
  ('fraud-logs'),
  ('tools'),
  ('services');

-- Shop Subcategories (using hardcoded category IDs)
INSERT OR IGNORE INTO shop_subcategories (name, category_id) VALUES 
  -- Enrolls (assuming category ID 1)
  ('Fresh Enrolls', 1),
  ('Aged Enrolls', 1), 
  ('Premium Enrolls', 1),
  -- Fraud Logs (assuming category ID 2)
  ('Bank Logs', 2),
  ('Credit Card Logs', 2),
  ('PayPal Logs', 2),
  -- Tools (assuming category ID 3)
  ('Checkers', 3),
  ('Generators', 3),
  -- Services (assuming category ID 4)
  ('Tutorials', 4),
  ('Consultations', 4);

-- Shop Items
INSERT OR IGNORE INTO shop_items (name, price, link, category_id, subcategory_id) VALUES 
  -- Fresh Enrolls (category 1, subcategory 1)
  ('US Fresh Bank Enrolls - High Balance', 250, 'https://t.me/rgbunion_shop', 1, 1),
  ('UK Fresh Credit Enrolls', 200, 'https://t.me/rgbunion_shop', 1, 1),
  ('CA Fresh PayPal Enrolls', 180, 'https://t.me/rgbunion_shop', 1, 1),
  
  -- Aged Enrolls (category 1, subcategory 2)
  ('US Aged Bank Enrolls - 6+ Months', 150, 'https://t.me/rgbunion_shop', 1, 2),
  ('EU Aged Business Enrolls', 300, 'https://t.me/rgbunion_shop', 1, 2),
  
  -- Premium Enrolls (category 1, subcategory 3)
  ('Premium US Bank Enrolls - $50K+ Balance', 500, 'https://t.me/rgbunion_premium', 1, 3),
  ('Premium Business Enrolls - Verified', 750, 'https://t.me/rgbunion_premium', 1, 3),
  
  -- Bank Logs (category 2, subcategory 4)
  ('Chase Bank Logs - Fresh', 120, 'https://t.me/rgbunion_logs', 2, 4),
  ('Wells Fargo Logs - High Balance', 150, 'https://t.me/rgbunion_logs', 2, 4),
  ('Bank of America Logs', 130, 'https://t.me/rgbunion_logs', 2, 4),
  
  -- Credit Card Logs (category 2, subcategory 5)
  ('Visa Platinum Logs', 80, 'https://t.me/rgbunion_logs', 2, 5),
  ('Mastercard Gold Logs', 75, 'https://t.me/rgbunion_logs', 2, 5),
  ('AmEx Black Card Logs', 200, 'https://t.me/rgbunion_logs', 2, 5),
  
  -- PayPal Logs (category 2, subcategory 6)
  ('PayPal Business Logs - Verified', 100, 'https://t.me/rgbunion_logs', 2, 6),
  ('PayPal Personal Logs - $5K+ Balance', 90, 'https://t.me/rgbunion_logs', 2, 6),
  
  -- Checkers (category 3, subcategory 7)
  ('CC Checker Pro - Multi-Gateway', 50, 'https://t.me/rgbunion_tools', 3, 7),
  ('Bank Account Checker', 75, 'https://t.me/rgbunion_tools', 3, 7),
  
  -- Generators (category 3, subcategory 8)
  ('Identity Generator Pro', 40, 'https://t.me/rgbunion_tools', 3, 8),
  ('Fullz Generator - US/UK/CA', 60, 'https://t.me/rgbunion_tools', 3, 8),
  
  -- Tutorials (category 4, subcategory 9)
  ('Cashout Methods Tutorial - Complete Guide', 100, 'https://t.me/rgbunion_services', 4, 9),
  ('Bank Drop Setup Guide', 80, 'https://t.me/rgbunion_services', 4, 9);

-- Website Links (using admin user ID 1)
INSERT OR IGNORE INTO websites (title, link, description, user_id) VALUES 
  ('RGBUnion Main Channel', 'https://t.me/rgbunion_main', 'Main RGBUnion Telegram channel for announcements, updates, and community discussions.', '1'),
  ('RGBUnion Shop', 'https://t.me/rgbunion_shop', 'Official RGBUnion shop for enrolls, logs, and premium services. Trusted vendor since 2020.', '1'),
  ('RGBUnion Premium', 'https://t.me/rgbunion_premium', 'Exclusive premium services and high-value enrolls for verified members only.', '1'),
  ('RGBUnion Logs', 'https://t.me/rgbunion_logs', 'Fresh bank logs, credit card data, and PayPal accounts. Updated daily with new drops.', '1'),
  ('RGBUnion Tools', 'https://t.me/rgbunion_tools', 'Professional tools for checking, generating, and validating various account types.', '1'),
  ('RGBUnion Services', 'https://t.me/rgbunion_services', 'Tutorials, guides, and consultation services for advanced cashout methods and techniques.', '1'),
  ('RGBUnion Support', 'https://t.me/rgbunion_support', '24/7 customer support for all RGBUnion services. Fast response guaranteed.', '1'),
  ('RGBUnion Reviews', 'https://t.me/rgbunion_reviews', 'Customer reviews and testimonials. Real feedback from verified buyers.', '1');