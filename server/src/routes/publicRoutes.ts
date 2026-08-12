import { Router, Response } from 'express';
import { getDb } from '../db';
import { resolvePublicTenant } from '../middleware/tenant';
import { AuthenticatedRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/public/resorts (List active resorts for dev switching / selector)
router.get('/resorts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const resorts = await db.all(
      `SELECT r.id, r.name, r.slug, r.custom_domain, t.theme_id 
       FROM resorts r 
       LEFT JOIN theme_settings t ON r.id = t.resort_id 
       WHERE r.status = 'active'
       ORDER BY r.created_at ASC`
    );
    res.json(resorts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch resorts list' });
  }
});

// GET /api/public/site - Returns complete site data for resolved tenant
router.get('/site', resolvePublicTenant, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const resortId = req.tenantResortId;
    if (!resortId) {
      return res.status(404).json({ error: 'Resort tenant not found' });
    }

    const db = await getDb();

    // 1. Resort Info
    const resort = await db.get('SELECT id, name, slug, custom_domain FROM resorts WHERE id = ?', [resortId]);
    if (!resort) {
      return res.status(404).json({ error: 'Resort not found' });
    }

    // 2. Website Settings & SEO
    const settings = await db.get('SELECT * FROM website_settings WHERE resort_id = ?', [resortId]);

    // 3. Theme Settings
    const theme = await db.get('SELECT * FROM theme_settings WHERE resort_id = ?', [resortId]);

    // 4. Homepage Sections (Ordered)
    const sections = await db.all(
      'SELECT * FROM homepage_sections WHERE resort_id = ? AND is_enabled = 1 ORDER BY display_order ASC',
      [resortId]
    );

    // 5. Active Rooms with linked Amenities and Images
    const roomsRaw = await db.all(
      'SELECT * FROM rooms WHERE resort_id = ? AND is_active = 1 ORDER BY display_order ASC',
      [resortId]
    );

    const rooms = [];
    for (const r of roomsRaw) {
      const images = await db.all(
        'SELECT id, image_url, caption, display_order FROM room_images WHERE room_id = ? ORDER BY display_order ASC',
        [r.id]
      );
      const amenities = await db.all(
        `SELECT a.id, a.name, a.icon_name, a.description 
         FROM amenities a 
         JOIN room_amenities ra ON a.id = ra.amenity_id 
         WHERE ra.room_id = ? AND a.is_active = 1`,
        [r.id]
      );
      rooms.push({ ...r, images, amenities });
    }

    // 6. Amenities
    const amenities = await db.all(
      'SELECT * FROM amenities WHERE resort_id = ? AND is_active = 1 ORDER BY display_order ASC',
      [resortId]
    );

    // 7. Gallery Categories & Images
    const galleryCategories = await db.all(
      'SELECT * FROM gallery_categories WHERE resort_id = ? ORDER BY display_order ASC',
      [resortId]
    );
    const galleryImages = await db.all(
      'SELECT * FROM gallery_images WHERE resort_id = ? ORDER BY display_order ASC',
      [resortId]
    );

    // 8. Experiences
    const experiences = await db.all(
      'SELECT * FROM experiences WHERE resort_id = ? AND is_active = 1 ORDER BY display_order ASC',
      [resortId]
    );

    // 9. Attractions
    const attractions = await db.all(
      'SELECT * FROM attractions WHERE resort_id = ? ORDER BY display_order ASC',
      [resortId]
    );

    // 10. Restaurant Items (Only if restaurant_enabled)
    let restaurantItems: any[] = [];
    if (!settings || settings.restaurant_enabled === 1) {
      restaurantItems = await db.all(
        'SELECT * FROM restaurant_items WHERE resort_id = ? AND is_active = 1 ORDER BY display_order ASC',
        [resortId]
      );
    }

    // 11. Testimonials
    const testimonials = await db.all(
      'SELECT * FROM testimonials WHERE resort_id = ? AND is_active = 1 ORDER BY display_order ASC',
      [resortId]
    );

    // 12. Contact Info & Social Links
    const contact = await db.get('SELECT * FROM contact_information WHERE resort_id = ?', [resortId]);
    const socialLinks = await db.all('SELECT * FROM social_links WHERE resort_id = ?', [resortId]);

    res.json({
      resort,
      settings: settings || {},
      theme: theme || { theme_id: 'luxury-dark' },
      sections,
      rooms,
      amenities,
      gallery: {
        categories: galleryCategories,
        images: galleryImages
      },
      experiences,
      attractions,
      restaurantItems,
      testimonials,
      contact: contact || {},
      socialLinks
    });
  } catch (err: any) {
    console.error('Public site fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/public/enquiry - Submit enquiry from public website
router.post('/enquiry', resolvePublicTenant, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const resortId = req.tenantResortId;
    if (!resortId) {
      return res.status(404).json({ error: 'Resort tenant not found' });
    }

    const { guest_name, email, phone, check_in, check_out, guests_count, room_preference, message } = req.body;

    if (!guest_name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required' });
    }

    const db = await getDb();
    const id = uuidv4();

    await db.run(
      `INSERT INTO enquiries (
        id, resort_id, guest_name, email, phone, check_in, check_out, guests_count, room_preference, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`,
      [
        id,
        resortId,
        guest_name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        check_in || null,
        check_out || null,
        guests_count || 1,
        room_preference || null,
        message || null
      ]
    );

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry_id: id });
  } catch (err: any) {
    console.error('Enquiry submission error:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

export default router;
