-- Clean Development Data for RGBUnion
-- Demo shop items with thumbnail support for development testing

-- Shop Categories
INSERT OR IGNORE INTO shop_categories (tag) VALUES
  ('electronics'),
  ('clothing'),
  ('books'),
  ('services');

-- Shop Subcategories
INSERT OR IGNORE INTO shop_subcategories (name, category_id) VALUES
  -- Electronics (assuming category ID 1)
  ('Computers', 1),
  ('Mobile Devices', 1),
  ('Gaming', 1),
  -- Clothing (assuming category ID 2)
  ('T-Shirts', 2),
  ('Hoodies', 2),
  ('Accessories', 2),
  -- Books (assuming category ID 3)
  ('Programming', 3),
  ('Design', 3),
  -- Services (assuming category ID 4)
  ('Consulting', 4),
  ('Training', 4);

-- Shop Items
INSERT OR IGNORE INTO shop_items (name, price, link, description, category_id, subcategory_id) VALUES
  -- Electronics - Computers
  ('Premium RGB Gaming PC', 150000, 'https://example.com/pc', 'High-performance gaming PC with RGB lighting and premium components. Perfect for gaming and content creation.', 1, 1),
  ('Ultrabook Pro 14"', 120000, 'https://example.com/laptop', 'Lightweight professional laptop with all-day battery life and stunning display.', 1, 1),

  -- Electronics - Mobile
  ('Flagship Smartphone', 80000, 'https://example.com/phone', 'Latest flagship smartphone with advanced camera system and 5G connectivity.', 1, 2),
  ('Wireless Earbuds Pro', 25000, 'https://example.com/earbuds', 'Premium wireless earbuds with noise cancellation and superior sound quality.', 1, 2),

  -- Electronics - Gaming
  ('RGB Mechanical Keyboard', 15000, 'https://example.com/keyboard', 'Premium mechanical keyboard with customizable RGB lighting and tactile switches.', 1, 3),
  ('Gaming Mouse Pro', 8000, 'https://example.com/mouse', 'High-precision gaming mouse with programmable buttons and RGB lighting.', 1, 3),

  -- Clothing - T-Shirts
  ('RGB Union Logo Tee', 3500, 'https://example.com/tshirt', 'Premium quality cotton t-shirt with RGB Union logo. Comfortable and stylish.', 2, 4),
  ('Programmer Life Tee', 3000, 'https://example.com/programmer-tee', 'Funny programming t-shirt perfect for developers and tech enthusiasts.', 2, 4),

  -- Clothing - Hoodies
  ('RGB Union Hoodie', 6500, 'https://example.com/hoodie', 'Comfortable hoodie with RGB Union branding. Perfect for cool weather and casual wear.', 2, 5),

  -- Books - Programming
  ('Advanced JavaScript Guide', 4500, 'https://example.com/js-book', 'Comprehensive guide to modern JavaScript development with practical examples.', 3, 7),
  ('Python for Data Science', 5200, 'https://example.com/python-book', 'Complete guide to Python programming for data science and machine learning.', 3, 7),

  -- Books - Design
  ('UI/UX Design Principles', 3800, 'https://example.com/design-book', 'Essential principles of user interface and user experience design.', 3, 8),

  -- Services - Consulting
  ('Web Development Consultation', 12000, 'https://example.com/consultation', 'Professional web development consultation session with expert developers.', 4, 9),
  ('Code Review Service', 8000, 'https://example.com/code-review', 'Professional code review service to improve code quality and performance.', 4, 9),

  -- Services - Training
  ('Programming Bootcamp', 50000, 'https://example.com/bootcamp', 'Intensive 12-week programming bootcamp covering full-stack development.', 4, 10),
  ('One-on-One Mentoring', 15000, 'https://example.com/mentoring', 'Personal mentoring sessions with experienced software developers.', 4, 10);

-- Website Links (using admin user ID 1)
INSERT OR IGNORE INTO websites (title, link, description, user_id) VALUES
  ('RGB Union Portfolio', 'https://github.com/rgbunion', 'Official RGB Union GitHub portfolio showcasing our open-source projects.', '1'),
  ('RGB Union Blog', 'https://blog.rgbunion.dev', 'Technical blog with programming tutorials and development insights.', '1'),
  ('RGB Union Documentation', 'https://docs.rgbunion.dev', 'Comprehensive documentation for RGB Union tools and libraries.', '1'),
  ('RGB Union Community', 'https://discord.gg/rgbunion', 'Join our community Discord for discussions and support.', '1'),
  ('RGB Union Newsletter', 'https://newsletter.rgbunion.dev', 'Subscribe to our newsletter for updates and tutorials.', '1');