import { getDb } from './index';

export async function initSchema() {
  const db = await getDb();

  // 1. Resorts Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resorts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      custom_domain TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      resort_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 3. Website Settings & SEO Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS website_settings (
      id TEXT PRIMARY KEY,
      resort_id TEXT UNIQUE NOT NULL,
      logo_url TEXT,
      favicon_url TEXT,
      tagline TEXT,
      short_description TEXT,
      full_description TEXT,
      meta_title TEXT,
      meta_description TEXT,
      keywords TEXT,
      og_image_url TEXT,
      canonical_url TEXT,
      hero_image_url TEXT,
      about_image_url TEXT,
      restaurant_enabled INTEGER DEFAULT 1,
      draft_mode INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  try { await db.exec('ALTER TABLE website_settings ADD COLUMN hero_image_url TEXT'); } catch (e) {}
  try { await db.exec('ALTER TABLE website_settings ADD COLUMN about_image_url TEXT'); } catch (e) {}

  // 4. Theme Settings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS theme_settings (
      id TEXT PRIMARY KEY,
      resort_id TEXT UNIQUE NOT NULL,
      theme_id TEXT NOT NULL DEFAULT 'luxury-dark',
      primary_color TEXT,
      secondary_color TEXT,
      accent_color TEXT,
      font_family TEXT,
      border_radius TEXT,
      header_style TEXT,
      hero_style TEXT,
      custom_css TEXT,
      hero_overlay_opacity REAL DEFAULT 0.65,
      custom_head_code TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  try { await db.exec('ALTER TABLE theme_settings ADD COLUMN custom_css TEXT'); } catch (e) {}
  try { await db.exec('ALTER TABLE theme_settings ADD COLUMN hero_overlay_opacity REAL DEFAULT 0.65'); } catch (e) {}
  try { await db.exec('ALTER TABLE theme_settings ADD COLUMN custom_head_code TEXT'); } catch (e) {}

  // 5. Homepage Sections Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS homepage_sections (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      section_key TEXT NOT NULL,
      title TEXT,
      subtitle TEXT,
      is_enabled INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      custom_config TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 6. Rooms Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      short_description TEXT,
      price REAL NOT NULL,
      discounted_price REAL,
      max_occupancy TEXT,
      bed_type TEXT,
      room_size TEXT,
      primary_image TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 7. Room Images Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS room_images (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );
  `);

  // 8. Amenities Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS amenities (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      description TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 9. Room Amenities Link Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS room_amenities (
      room_id TEXT NOT NULL,
      amenity_id TEXT NOT NULL,
      PRIMARY KEY (room_id, amenity_id),
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
    );
  `);

  // 10. Gallery Categories Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_categories (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 11. Gallery Images Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      category_id TEXT,
      image_url TEXT NOT NULL,
      title TEXT,
      alt_text TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
    );
  `);

  // 12. Experiences Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      price REAL,
      duration TEXT,
      location TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 13. Attractions Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attractions (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      distance TEXT,
      travel_time TEXT,
      image_url TEXT,
      google_maps_url TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 14. Restaurant Items Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS restaurant_items (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      price REAL,
      image_url TEXT,
      is_vegetarian INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 15. Testimonials Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      location_or_title TEXT,
      rating INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      avatar_url TEXT,
      review_date TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 16. Contact Information Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_information (
      id TEXT PRIMARY KEY,
      resort_id TEXT UNIQUE NOT NULL,
      phone TEXT,
      whatsapp_number TEXT,
      email TEXT,
      address TEXT,
      google_maps_url TEXT,
      latitude REAL,
      longitude REAL,
      check_in_time TEXT DEFAULT '14:00',
      check_out_time TEXT DEFAULT '11:00',
      cancellation_policy TEXT,
      terms_and_conditions TEXT,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 17. Social Links Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 18. Enquiries Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      guest_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      guests_count INTEGER DEFAULT 1,
      room_preference TEXT,
      message TEXT,
      status TEXT DEFAULT 'NEW',
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  // 19. Invoices Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      resort_id TEXT NOT NULL,
      invoice_number TEXT UNIQUE NOT NULL,
      guest_name TEXT NOT NULL,
      guest_email TEXT,
      guest_phone TEXT,
      room_name TEXT,
      check_in_date TEXT,
      check_out_date TEXT,
      num_nights INTEGER DEFAULT 1,
      rate_per_night REAL DEFAULT 0,
      additional_charges REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_status TEXT DEFAULT 'PENDING',
      payment_method TEXT DEFAULT 'UPI / GPay',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Database schema initialized successfully.');
}
