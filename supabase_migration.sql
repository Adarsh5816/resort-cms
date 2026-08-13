-- ============================================================
-- SUPABASE POSTGRESQL DATABASE MIGRATION & SEED FOR RESORT CMS
-- Copy EVERYTHING in this file (Ctrl+A -> Ctrl+C)
-- Open Supabase SQL Editor -> Create New Query -> Paste & Click RUN
-- ============================================================

-- Clean up existing tables if re-running
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS contact_information CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS restaurant_items CASCADE;
DROP TABLE IF EXISTS attractions CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;
DROP TABLE IF EXISTS room_amenities CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS room_images CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS homepage_sections CASCADE;
DROP TABLE IF EXISTS theme_settings CASCADE;
DROP TABLE IF EXISTS website_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS resorts CASCADE;

-- 1. Resorts Table
CREATE TABLE resorts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  custom_domain VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Website Settings & SEO
CREATE TABLE website_settings (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) UNIQUE REFERENCES resorts(id) ON DELETE CASCADE,
  logo_url TEXT,
  favicon_url TEXT,
  tagline VARCHAR(255),
  short_description TEXT,
  full_description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  restaurant_enabled BOOLEAN DEFAULT TRUE,
  draft_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Theme Settings Table
CREATE TABLE theme_settings (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) UNIQUE REFERENCES resorts(id) ON DELETE CASCADE,
  theme_id VARCHAR(50) NOT NULL DEFAULT 'lexur-forest',
  primary_color VARCHAR(50),
  secondary_color VARCHAR(50),
  accent_color VARCHAR(50),
  font_family VARCHAR(100),
  border_radius VARCHAR(20),
  header_style VARCHAR(50),
  hero_style VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Homepage Sections
CREATE TABLE homepage_sections (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  section_key VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  is_enabled BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  custom_config JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Rooms Table
CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price NUMERIC(10, 2) NOT NULL,
  discounted_price NUMERIC(10, 2),
  max_occupancy VARCHAR(100),
  bed_type VARCHAR(100),
  room_size VARCHAR(100),
  primary_image TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Room Images Table
CREATE TABLE room_images (
  id VARCHAR(36) PRIMARY KEY,
  room_id VARCHAR(36) REFERENCES rooms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  display_order INT DEFAULT 0
);

-- 8. Amenities Table
CREATE TABLE amenities (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

-- 9. Room Amenities Junction
CREATE TABLE room_amenities (
  room_id VARCHAR(36) REFERENCES rooms(id) ON DELETE CASCADE,
  amenity_id VARCHAR(36) REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, amenity_id)
);

-- 10. Gallery Categories & Images
CREATE TABLE gallery_categories (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE gallery_images (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  category_id VARCHAR(36) REFERENCES gallery_categories(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0
);

-- 11. Experiences Table
CREATE TABLE experiences (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(10,2),
  duration VARCHAR(100),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

-- 12. Attractions Table
CREATE TABLE attractions (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  distance VARCHAR(100),
  travel_time VARCHAR(100),
  image_url TEXT,
  google_maps_url TEXT,
  display_order INT DEFAULT 0
);

-- 13. Restaurant Items Table
CREATE TABLE restaurant_items (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

-- 14. Testimonials Table
CREATE TABLE testimonials (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  location_or_title VARCHAR(255),
  rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  avatar_url TEXT,
  review_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0
);

-- 15. Contact Information Table
CREATE TABLE contact_information (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) UNIQUE REFERENCES resorts(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  whatsapp_number VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  google_maps_url TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  check_in_time VARCHAR(50) DEFAULT '14:00',
  check_out_time VARCHAR(50) DEFAULT '11:00',
  cancellation_policy TEXT,
  terms_and_conditions TEXT
);

-- 16. Social Links Table
CREATE TABLE social_links (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL
);

-- 17. Enquiries Table
CREATE TABLE enquiries (
  id VARCHAR(36) PRIMARY KEY,
  resort_id VARCHAR(36) REFERENCES resorts(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  check_in DATE,
  check_out DATE,
  guests_count INT DEFAULT 1,
  room_preference VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED LEXUR GREEN SERVICED VILLA DATA
-- ============================================================

INSERT INTO resorts (id, name, slug, custom_domain, status)
VALUES ('lexur-resort-001', 'Lexur Green Serviced Villa', 'lexur-green', 'www.lexurbooking.in', 'active');

-- Super Admin (Password: lock@Jyothika5816)
INSERT INTO users (id, email, password_hash, name, role)
VALUES ('user-superadmin-001', 'adarsh.m.sasi@gmail.com', '$2a$10$ekyD3nfNUTP5/10i1kMLpeQel7WkOC4lQ0.N52rqkisXeBgm2aiXW', 'Adarsh (Super Admin)', 'SUPER_ADMIN')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'SUPER_ADMIN';

-- Akash Valluvady Admin (Password: 8606778603)
INSERT INTO users (id, email, password_hash, name, role, resort_id)
VALUES ('user-akash-001', 'akashvalluvady@gmail.com', '$2a$10$22tB8oB.0eQZcT412XkHie11S8rU26zZ0jT0p50bK12.k.L.x1mpy', 'Akash Valluvady', 'RESORT_ADMIN', 'lexur-resort-001')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Website Settings & SEO
INSERT INTO website_settings (id, resort_id, tagline, short_description, full_description, meta_title, meta_description, keywords, restaurant_enabled)
VALUES (
  'ws-lexur-001', 'lexur-resort-001',
  '3BHK Serviced Villa near Forest Border with Night Jungle Safari',
  'Experience the real feel of being deep into nature right near the forest border in Valluvady, Wayanad.',
  'Lexur Green Serviced Villa is a pristine 3BHK private retreat located in Valluvady, Wayanad right near the forest border. Unwind surrounded by lush greenery, enjoy thrilling Night Jungle Safaris, fully equipped kitchen, secure parking, free Wi-Fi, and delicious homely food prepared on order.',
  'Lexur Green Serviced Villa | 3BHK Private Villa in Valluvady Wayanad',
  'Book your stay at Lexur Green Serviced Villa, Valluvady Wayanad. 3BHK Private Villa, Night Jungle Safari, kitchen, homely food & forest views.',
  'lexur green, wayanad serviced villa, valluvady villa, night jungle safari wayanad, 3bhk villa wayanad, homely food stay',
  TRUE
);

-- Theme Settings
INSERT INTO theme_settings (id, resort_id, theme_id, primary_color, secondary_color, accent_color)
VALUES ('ts-lexur-001', 'lexur-resort-001', 'lexur-forest', '#0A2E1C', '#0F3822', '#2E7D52');

-- Homepage Sections
INSERT INTO homepage_sections (id, resort_id, section_key, title, subtitle, is_enabled, display_order)
VALUES 
  ('sec-1', 'lexur-resort-001', 'hero', 'Lexur Green Serviced Villa', '3BHK Private Villa near Forest Border • Valluvady, Wayanad', TRUE, 1),
  ('sec-2', 'lexur-resort-001', 'about', 'Nature at Your Doorstep', 'Valluvady Forest Sanctuary', TRUE, 2),
  ('sec-3', 'lexur-resort-001', 'experiences', 'Night Jungle Safari & Forest Trails', 'Unforgettable Wilderness Adventures', TRUE, 3),
  ('sec-4', 'lexur-resort-001', 'rooms', 'Villa & Room Accommodations', '3BHK Private Villa with Modern Amenities', TRUE, 4),
  ('sec-5', 'lexur-resort-001', 'amenities', 'Villa Facilities & Services', 'Kitchen, Parking, Wi-Fi & Homely Food', TRUE, 5),
  ('sec-6', 'lexur-resort-001', 'gallery', 'Forest & Villa Gallery', 'Immerse in Lush Wayanad Greenery', TRUE, 6),
  ('sec-7', 'lexur-resort-001', 'restaurant', 'Homely Food on Order', 'Authentic Kerala Cooking', TRUE, 7),
  ('sec-8', 'lexur-resort-001', 'testimonials', 'Guest Experiences', 'Memories from Forest Border', TRUE, 8),
  ('sec-9', 'lexur-resort-001', 'contact', 'Reserve Your Stay at Lexur Green', 'Valluvady, Wayanad, Kerala', TRUE, 9);

-- Contact Information
INSERT INTO contact_information (id, resort_id, phone, whatsapp_number, email, address, google_maps_url)
VALUES (
  'ci-lexur-001', 'lexur-resort-001',
  '+91 80787 76634', '918078776634',
  'lexurbooking@gmail.com',
  'Valluvady, Sulthan Bathery, Wayanad, Kerala, India',
  'https://maps.google.com/?q=Valluvady+Wayanad'
);
