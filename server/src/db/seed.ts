import { getDb } from './index';
import { initSchema } from './schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  await initSchema();
  const db = await getDb();

  // Protect customer data: If database already has resorts, NEVER wipe or delete customer uploads!
  const existingResort = await db.get('SELECT id FROM resorts LIMIT 1');
  if (existingResort) {
    console.log('✅ Database already populated with customer data. Preserving all uploaded images & data.');
    return;
  }

  console.log('🌱 Starting initial database seeding with real Lexur Green Serviced Villa...');

  const superAdminPasswordHash = await bcrypt.hash('lock@Jyothika5816', 10);
  const akashPasswordHash = await bcrypt.hash('8606778603', 10);
  const resortPasswordHash = await bcrypt.hash('resort123', 10);

  // 1. Super Admin User
  const superAdminId = uuidv4();
  await db.run(
    `INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)`,
    [superAdminId, 'adarsh.m.sasi@gmail.com', superAdminPasswordHash, 'Adarsh (Super Admin)', 'SUPER_ADMIN']
  );

  // ==========================================
  // RESORT 1 (PRIMARY): Lexur Green Serviced Villa (Wayanad)
  // ==========================================
  const resortLexur_Id = uuidv4();
  await db.run(
    `INSERT INTO resorts (id, name, slug, custom_domain, status) VALUES (?, ?, ?, ?, ?)`,
    [resortLexur_Id, 'Lexur Green Serviced Villa', 'lexur-green', 'www.lexurbooking.in', 'active']
  );

  // Akash Valluvady Admin User
  await db.run(
    `INSERT INTO users (id, email, password_hash, name, role, resort_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), 'akashvalluvady@gmail.com', akashPasswordHash, 'Akash Valluvady', 'RESORT_ADMIN', resortLexur_Id]
  );

  // Lexur Green Website Settings & SEO
  await db.run(
    `INSERT INTO website_settings (
      id, resort_id, logo_url, tagline, short_description, full_description,
      meta_title, meta_description, keywords, restaurant_enabled, draft_mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      resortLexur_Id,
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&q=80',
      '3BHK Serviced Villa near Forest Border with Night Jungle Safari',
      'Experience the real feel of being deep into nature right near the forest border in Valluvady, Wayanad.',
      'Lexur Green Serviced Villa is a pristine 3BHK private retreat located in Valluvady, Wayanad right near the forest border. Unwind surrounded by lush greenery, enjoy thrilling Night Jungle Safaris, fully equipped kitchen, secure parking, free Wi-Fi, and delicious homely food prepared on order.',
      'Lexur Green Serviced Villa | 3BHK Private Villa in Valluvady Wayanad',
      'Book your stay at Lexur Green Serviced Villa, Valluvady Wayanad. 3BHK Private Villa, Night Jungle Safari, kitchen, homely food & forest views.',
      'lexur green, wayanad serviced villa, valluvady villa, night jungle safari wayanad, 3bhk villa wayanad, homely food stay',
      1, 0
    ]
  );

  // Lexur Green Theme Settings (Forest Nature Emerald & Deer Motif)
  await db.run(
    `INSERT INTO theme_settings (
      id, resort_id, theme_id, primary_color, secondary_color, accent_color, font_family, border_radius, header_style, hero_style
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      resortLexur_Id,
      'lexur-forest',
      '#0A2E1C', '#0F3822', '#2E7D52', 'Merriweather', '0.75rem', 'emerald-bar', 'forest-story'
    ]
  );

  // Lexur Green Homepage Sections
  const sectionsLexur = [
    { key: 'hero', title: 'Lexur Green Serviced Villa', subtitle: '3BHK Private Villa near Forest Border • Valluvady, Wayanad', order: 1 },
    { key: 'about', title: 'Nature at Your Doorstep', subtitle: 'Valluvady Forest Sanctuary', order: 2 },
    { key: 'experiences', title: 'Night Jungle Safari & Forest Trails', subtitle: 'Unforgettable Wilderness Adventures', order: 3 },
    { key: 'rooms', title: 'Villa & Room Accommodations', subtitle: '3BHK Private Villa with Modern Amenities', order: 4 },
    { key: 'amenities', title: 'Villa Facilities & Services', subtitle: 'Kitchen, Parking, Wi-Fi & Homely Food', order: 5 },
    { key: 'gallery', title: 'Forest & Villa Gallery', subtitle: 'Immerse in Lush Wayanad Greenery', order: 6 },
    { key: 'restaurant', title: 'Homely Food on Order', subtitle: 'Authentic Kerala Cooking', order: 7 },
    { key: 'testimonials', title: 'Guest Experiences', subtitle: 'Memories from Forest Border', order: 8 },
    { key: 'contact', title: 'Reserve Your Stay at Lexur Green', subtitle: 'Valluvady, Wayanad, Kerala', order: 9 }
  ];

  for (const s of sectionsLexur) {
    await db.run(
      `INSERT INTO homepage_sections (id, resort_id, section_key, title, subtitle, is_enabled, display_order)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [uuidv4(), resortLexur_Id, s.key, s.title, s.subtitle, s.order]
    );
  }

  // Lexur Green Rooms
  const roomL1 = uuidv4();
  await db.run(
    `INSERT INTO rooms (id, resort_id, name, slug, description, short_description, price, discounted_price, max_occupancy, bed_type, room_size, primary_image, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      roomL1, resortLexur_Id, 'Full 3BHK Private Serviced Villa', 'full-3bhk-private-villa',
      'Entire 3BHK private serviced villa with 3 spacious king bedrooms, attached bathrooms, furnished living room, fully equipped kitchen, private balcony, and direct forest garden view.',
      'Entire 3BHK Villa with Kitchen, Living Room & Forest Garden View.',
      6500, 5999, '6 - 10 Guests', '3 King Beds + Sofa Bed', '1,800 sq.ft',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', 1
    ]
  );

  const roomL2 = uuidv4();
  await db.run(
    `INSERT INTO rooms (id, resort_id, name, slug, description, short_description, price, discounted_price, max_occupancy, bed_type, room_size, primary_image, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      roomL2, resortLexur_Id, 'Deluxe Forest View Bedroom', 'deluxe-forest-view-bedroom',
      'Spacious bedroom with teakwood furnishings, large glass windows facing the lush forest border, private ensuite bathroom, and free Wi-Fi.',
      'Forest border view bedroom with ensuite bath & teak furnishings.',
      2500, 2199, '2 Adults + 1 Child', '1 King Bed', '400 sq.ft',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', 2
    ]
  );

  const roomL3 = uuidv4();
  await db.run(
    `INSERT INTO rooms (id, resort_id, name, slug, description, short_description, price, discounted_price, max_occupancy, bed_type, room_size, primary_image, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      roomL3, resortLexur_Id, 'Executive Family Suite Bedroom', 'executive-family-suite-bedroom',
      'Premium family room inside the villa featuring two queen beds, balcony access, forest view, and high-speed Wi-Fi.',
      'Family suite room with balcony access & double beds.',
      3200, 2799, '4 Guests', '2 Queen Beds', '550 sq.ft',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80', 3
    ]
  );

  // Lexur Green Dynamic Amenities (Exact features from card)
  const amenitiesLexur = [
    { name: '3BHK Private Villa', icon: 'home', desc: 'Full 3-bedroom private serviced villa for family & group stays', featured: 1 },
    { name: 'Fully Equipped Kitchen', icon: 'utensils', desc: 'Cook your own meals or request chef support', featured: 1 },
    { name: 'Night Jungle Safari', icon: 'compass', desc: 'Exciting nocturnal wildlife tracking near forest border', featured: 1 },
    { name: 'Secure Private Parking', icon: 'car', desc: 'Spacious & guarded parking inside villa compound', featured: 1 },
    { name: 'Free High-Speed Wi-Fi', icon: 'wifi', desc: 'Seamless high-speed internet throughout property', featured: 1 },
    { name: 'Homely Food on Order', icon: 'coffee', desc: 'Freshly prepared traditional Kerala & Wayanad dishes', featured: 1 },
    { name: 'Forest Border Location', icon: 'trees', desc: 'Situated in Valluvady surrounded by rich natural greenery', featured: 1 },
    { name: 'Campfire & Lawn', icon: 'flame', desc: 'Evening bonfire under starry skies', featured: 1 }
  ];

  for (const a of amenitiesLexur) {
    const amenityId = uuidv4();
    await db.run(
      `INSERT INTO amenities (id, resort_id, name, icon_name, description, is_featured, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
      [amenityId, resortLexur_Id, a.name, a.icon, a.desc, a.featured]
    );

    await db.run(`INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)`, [roomL1, amenityId]);
    await db.run(`INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)`, [roomL2, amenityId]);
    await db.run(`INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)`, [roomL3, amenityId]);
  }

  // Lexur Green Gallery Categories & Images
  const catL1 = uuidv4();
  await db.run(`INSERT INTO gallery_categories (id, resort_id, name, display_order) VALUES (?, ?, 'Villa & Interiors', 1)`, [catL1, resortLexur_Id]);
  const catL2 = uuidv4();
  await db.run(`INSERT INTO gallery_categories (id, resort_id, name, display_order) VALUES (?, ?, 'Forest & Safari', 2)`, [catL2, resortLexur_Id]);

  const galleryImagesLexur = [
    { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', title: 'Lexur Green Villa Exterior', cat: catL1 },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', title: 'Living Room & Dining', cat: catL1 },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', title: 'Forest Border Greenery', cat: catL2 },
    { url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80', title: 'Night Jungle Safari Trail', cat: catL2 },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', title: 'Master Bedroom', cat: catL1 }
  ];

  for (let i = 0; i < galleryImagesLexur.length; i++) {
    const img = galleryImagesLexur[i];
    await db.run(
      `INSERT INTO gallery_images (id, resort_id, category_id, image_url, title, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), resortLexur_Id, img.cat, img.url, img.title, i + 1]
    );
  }

  // Lexur Green Experiences (Night Safari Highlight)
  await db.run(
    `INSERT INTO experiences (id, resort_id, title, description, image_url, price, duration, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Night Jungle Safari in Wayanad',
      'Experience the adrenaline of an authentic nocturnal safari along the Valluvady forest border. Spot wild deer, elephants, and rare nocturnal flora.',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80', 1800, '3 Hours', 'Valluvady Forest Border'
    ]
  );
  await db.run(
    `INSERT INTO experiences (id, resort_id, title, description, image_url, price, duration, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Campfire & Homely Barbecue',
      'Gather around a roaring campfire in the villa lawn with freshly prepared local Kerala dishes and barbecue.',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', 800, '2 Hours', 'Villa Garden Lawn'
    ]
  );

  // Lexur Green Attractions
  await db.run(
    `INSERT INTO attractions (id, resort_id, name, description, distance, travel_time, image_url, google_maps_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Muthanga Wildlife Sanctuary',
      'Renowned elephant sanctuary and dense teak forest reserve.',
      '8 km', '15 mins drive',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      'https://maps.google.com/?q=Muthanga+Wildlife+Sanctuary'
    ]
  );
  await db.run(
    `INSERT INTO attractions (id, resort_id, name, description, distance, travel_time, image_url, google_maps_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Edakkal Ancient Caves',
      'Neolithic rock carvings and panoramic mountain viewpoint.',
      '18 km', '30 mins drive',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      'https://maps.google.com/?q=Edakkal+Caves'
    ]
  );

  // Lexur Green Homely Food Menu Items
  await db.run(
    `INSERT INTO restaurant_items (id, resort_id, name, category, description, price, image_url, is_vegetarian)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Homely Wayanad Chicken Curry & Appam', 'Dinner',
      'Freshly cooked homely Wayanad chicken curry made with roasted spices served with hot fluffy appams.',
      350, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&q=80', 0
    ]
  );
  await db.run(
    `INSERT INTO restaurant_items (id, resort_id, name, category, description, price, image_url, is_vegetarian)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Traditional Kerala Breakfast (Puttu & Kadala)', 'Breakfast',
      'Steamed rice puttu served with spicy black chickpea curry and fresh banana.',
      180, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80', 1
    ]
  );

  // Lexur Green Testimonials
  await db.run(
    `INSERT INTO testimonials (id, resort_id, customer_name, location_or_title, rating, review_text, avatar_url, review_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id, 'Rahul & Family', 'Kochi, Kerala', 5,
      'The 3BHK villa was pristine! Being right next to the Valluvady forest border was magical. The Night Jungle Safari organized by Akash was the highlight of our Wayanad trip!',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', '2026-08-05'
    ]
  );

  // Lexur Green Contact Information (Exact details from business card)
  await db.run(
    `INSERT INTO contact_information (id, resort_id, phone, whatsapp_number, email, address, google_maps_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(), resortLexur_Id,
      '+91 80787 76634',
      '918078776634',
      'lexurbooking@gmail.com',
      'Valluvady, Sulthan Bathery, Wayanad, Kerala, India',
      'https://maps.google.com/?q=Valluvady+Wayanad'
    ]
  );

  // ==========================================
  // RESORT 2: Grand Royal Luxury Haven (Theme 1: Luxury Dark)
  // ==========================================
  const resortA_Id = uuidv4();
  await db.run(
    `INSERT INTO resorts (id, name, slug, custom_domain, status) VALUES (?, ?, ?, ?, ?)`,
    [resortA_Id, 'Grand Royal Luxury Haven', 'grand-royal', 'grandroyal.local', 'active']
  );

  await db.run(
    `INSERT INTO users (id, email, password_hash, name, role, resort_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), 'admin@grandroyal.com', resortPasswordHash, 'Grand Royal Manager', 'RESORT_ADMIN', resortA_Id]
  );

  await db.run(
    `INSERT INTO website_settings (id, resort_id, tagline, short_description, full_description, restaurant_enabled)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), resortA_Id, 'Exquisite Opulence on the Oceanfront', 'World-class hospitality & luxury suites.', 'Grand Royal sanctuary.', 1]
  );

  await db.run(
    `INSERT INTO theme_settings (id, resort_id, theme_id) VALUES (?, ?, 'luxury-dark')`,
    [uuidv4(), resortA_Id]
  );

  // ==========================================
  // RESORT 3: MetroStar City & Beach Hotel (Theme 3: Modern Hotel Clean)
  // ==========================================
  const resortC_Id = uuidv4();
  await db.run(
    `INSERT INTO resorts (id, name, slug, custom_domain, status) VALUES (?, ?, ?, ?, ?)`,
    [resortC_Id, 'MetroStar City & Beach Hotel', 'metrostar-hotel', 'metrostar.local', 'active']
  );

  await db.run(
    `INSERT INTO users (id, email, password_hash, name, role, resort_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), 'admin@metrostar.com', resortPasswordHash, 'MetroStar Hotel Manager', 'RESORT_ADMIN', resortC_Id]
  );

  await db.run(
    `INSERT INTO website_settings (id, resort_id, tagline, short_description, full_description, restaurant_enabled)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), resortC_Id, 'Sleek Modern Luxury in Coastal Metropolis', 'High-speed business amenities.', 'MetroStar hotel.', 1]
  );

  await db.run(
    `INSERT INTO theme_settings (id, resort_id, theme_id) VALUES (?, ?, 'modern-hotel')`,
    [uuidv4(), resortC_Id]
  );

  console.log('✅ Seeding completed! Real Lexur Green Serviced Villa added as primary resort.');
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}
