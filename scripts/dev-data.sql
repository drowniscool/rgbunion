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
INSERT OR IGNORE INTO shop_items (name, price, link, description, category_id, subcategory_id) VALUES
  -- Fresh Enrolls (category 1, subcategory 1)
  ('US Fresh Bank Enrolls - High Balance', 25000, 'https://t.me/rgbunion_shop', 'Premium US bank enrolls with balances exceeding $10K. Freshly enrolled accounts with clean history and no previous activity. Perfect for high-value operations.', 1, 1),
  ('UK Fresh Credit Enrolls', 20000, 'https://t.me/rgbunion_shop', 'Fresh UK credit card enrolls with high limits and excellent credit scores. Recently enrolled with verified information and clean transaction history.', 1, 1),
  ('CA Fresh PayPal Enrolls', 18000, 'https://t.me/rgbunion_shop', 'Canadian PayPal enrolls with verified business accounts. Fresh enrollments with clean history and high transaction limits for immediate use.', 1, 1),

  -- Aged Enrolls (category 1, subcategory 2)
  ('US Aged Bank Enrolls - 6+ Months', 15000, 'https://t.me/rgbunion_shop', 'Seasoned US bank enrolls aged 6+ months with established transaction history. Lower risk profile with proven stability and trustworthy backgrounds.', 1, 2),
  ('EU Aged Business Enrolls', 30000, 'https://t.me/rgbunion_shop', 'Established European business enrolls with 1+ year history. High-value commercial accounts with verified business documentation and excellent standings.', 1, 2),

  -- Premium Enrolls (category 1, subcategory 3)
  ('Premium US Bank Enrolls - $50K+ Balance', 50000, 'https://t.me/rgbunion_premium', 'Exclusive premium US bank enrolls with balances exceeding $50K. Hand-picked accounts with impeccable history and maximum security protocols.', 1, 3),
  ('Premium Business Enrolls - Verified', 75000, 'https://t.me/rgbunion_premium', 'Elite business enrolls with full verification and corporate backing. Multi-million dollar companies with established credit lines and international capabilities.', 1, 3),

  -- Bank Logs (category 2, subcategory 4)
  ('Chase Bank Logs - Fresh', 12000, 'https://t.me/rgbunion_logs', 'Fresh Chase bank logs with online banking access. Complete credentials including username, password, and security questions for immediate access.', 2, 4),
  ('Wells Fargo Logs - High Balance', 15000, 'https://t.me/rgbunion_logs', 'Wells Fargo logs featuring accounts with $25K+ balances. Premium logs with verified high-value accounts and full access credentials.', 2, 4),
  ('Bank of America Logs', 13000, 'https://t.me/rgbunion_logs', 'Bank of America online banking logs with complete access. Includes login credentials, security info, and account details for seamless access.', 2, 4),

  -- Credit Card Logs (category 2, subcategory 5)
  ('Visa Platinum Logs', 8000, 'https://t.me/rgbunion_logs', 'Visa Platinum credit card logs with high limits and excellent scores. Includes full card details, billing info, and online banking access.', 2, 5),
  ('Mastercard Gold Logs', 7500, 'https://t.me/rgbunion_logs', 'Mastercard Gold logs with verified high-limit cards. Complete package includes card details, CVV, and cardholder information for transactions.', 2, 5),
  ('AmEx Black Card Logs', 20000, 'https://t.me/rgbunion_logs', 'Exclusive American Express Black Card logs. Ultra-premium cards with unlimited spending and VIP cardholder benefits. Complete access package included.', 2, 5),

  -- PayPal Logs (category 2, subcategory 6)
  ('PayPal Business Logs - Verified', 10000, 'https://t.me/rgbunion_logs', 'Verified PayPal business account logs with high transaction limits. Complete access to business accounts with established payment history and verification.', 2, 6),
  ('PayPal Personal Logs - $5K+ Balance', 9000, 'https://t.me/rgbunion_logs', 'Personal PayPal logs with $5K+ verified balances. Includes full login credentials and linked bank account information for immediate access.', 2, 6),

  -- Checkers (category 3, subcategory 7)
  ('CC Checker Pro - Multi-Gateway', 5000, 'https://t.me/rgbunion_tools', 'Professional credit card checker supporting multiple payment gateways. Fast, reliable checking with live/dead status and response codes. Includes updates and support.', 3, 7),
  ('Bank Account Checker', 7500, 'https://t.me/rgbunion_tools', 'Advanced bank account validation tool with real-time checking capabilities. Supports major US and international banks with detailed response analysis.', 3, 7),

  -- Generators (category 3, subcategory 8)
  ('Identity Generator Pro', 4000, 'https://t.me/rgbunion_tools', 'Professional identity generator creating realistic profiles with matching documentation. Generates SSN, addresses, and personal details for multiple countries.', 3, 8),
  ('Fullz Generator - US/UK/CA', 6000, 'https://t.me/rgbunion_tools', 'Complete fullz generator for US, UK, and Canadian identities. Creates comprehensive profiles with matching credit reports and background information.', 3, 8),

  -- Tutorials (category 4, subcategory 9)
  ('Cashout Methods Tutorial - Complete Guide', 10000, 'https://t.me/rgbunion_services', 'Comprehensive tutorial covering all major cashout methods and techniques. Step-by-step guides with real examples and safety protocols. Updated monthly.', 4, 9),
  ('Bank Drop Setup Guide', 8000, 'https://t.me/rgbunion_services', 'Detailed guide for setting up secure bank drops with minimal risk. Covers account opening, aging techniques, and operational security measures.', 4, 9);

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