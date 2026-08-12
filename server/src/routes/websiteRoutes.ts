import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/website/settings
router.get('/settings', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const settings = await db.get('SELECT * FROM website_settings WHERE resort_id = ?', [req.tenantResortId]);
    const theme = await db.get('SELECT * FROM theme_settings WHERE resort_id = ?', [req.tenantResortId]);
    const sections = await db.all('SELECT * FROM homepage_sections WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    const contact = await db.get('SELECT * FROM contact_information WHERE resort_id = ?', [req.tenantResortId]);
    const resort = await db.get('SELECT name, slug, custom_domain FROM resorts WHERE id = ?', [req.tenantResortId]);

    res.json({
      resort: resort || {},
      settings: settings || {},
      theme: theme || { theme_id: 'luxury-dark' },
      sections,
      contact: contact || {}
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch website settings' });
  }
});

// PUT /api/website/profile - Update resort metadata & profile info
router.put('/profile', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, tagline, short_description, full_description, logo_url, favicon_url } = req.body;
    const db = await getDb();

    if (name) {
      await db.run('UPDATE resorts SET name = ? WHERE id = ?', [name, req.tenantResortId]);
    }

    await db.run(
      `UPDATE website_settings SET
        tagline = COALESCE(?, tagline),
        short_description = COALESCE(?, short_description),
        full_description = COALESCE(?, full_description),
        logo_url = COALESCE(?, logo_url),
        favicon_url = COALESCE(?, favicon_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE resort_id = ?`,
      [tagline, short_description, full_description, logo_url, favicon_url, req.tenantResortId]
    );

    res.json({ message: 'Resort profile updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update resort profile' });
  }
});

// PUT /api/website/seo - Update SEO settings
router.put('/seo', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { meta_title, meta_description, keywords, og_image_url, canonical_url } = req.body;
    const db = await getDb();

    await db.run(
      `UPDATE website_settings SET
        meta_title = ?,
        meta_description = ?,
        keywords = ?,
        og_image_url = ?,
        canonical_url = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE resort_id = ?`,
      [meta_title || null, meta_description || null, keywords || null, og_image_url || null, canonical_url || null, req.tenantResortId]
    );

    res.json({ message: 'SEO settings updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update SEO settings' });
  }
});

// PUT /api/website/theme - Change Theme (luxury-dark, kerala-nature, modern-hotel)
router.put('/theme', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { theme_id, primary_color, secondary_color, accent_color, font_family, border_radius, header_style, hero_style } = req.body;
    const db = await getDb();

    if (!theme_id) {
      return res.status(400).json({ error: 'theme_id is required' });
    }

    await db.run(
      `UPDATE theme_settings SET
        theme_id = ?,
        primary_color = COALESCE(?, primary_color),
        secondary_color = COALESCE(?, secondary_color),
        accent_color = COALESCE(?, accent_color),
        font_family = COALESCE(?, font_family),
        border_radius = COALESCE(?, border_radius),
        header_style = COALESCE(?, header_style),
        hero_style = COALESCE(?, hero_style),
        updated_at = CURRENT_TIMESTAMP
       WHERE resort_id = ?`,
      [theme_id, primary_color, secondary_color, accent_color, font_family, border_radius, header_style, hero_style, req.tenantResortId]
    );

    res.json({ message: 'Theme updated successfully', theme_id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update theme settings' });
  }
});

// PUT /api/website/sections - Update Homepage Sections Order and Visibility
router.put('/sections', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sections } = req.body; // Array of { id or section_key, is_enabled, display_order }
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'sections array is required' });
    }

    const db = await getDb();
    for (const sec of sections) {
      await db.run(
        `UPDATE homepage_sections SET
          is_enabled = ?,
          display_order = ?,
          title = COALESCE(?, title),
          subtitle = COALESCE(?, subtitle)
         WHERE (id = ? OR section_key = ?) AND resort_id = ?`,
        [sec.is_enabled ? 1 : 0, sec.display_order, sec.title || null, sec.subtitle || null, sec.id || sec.section_key, sec.section_key || sec.id, req.tenantResortId]
      );
    }

    res.json({ message: 'Homepage sections reordered successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reorder homepage sections' });
  }
});

// PUT /api/website/contact - Update contact & WhatsApp details
router.put('/contact', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phone, whatsapp_number, email, address, google_maps_url, check_in_time, check_out_time, cancellation_policy } = req.body;
    const db = await getDb();

    await db.run(
      `UPDATE contact_information SET
        phone = COALESCE(?, phone),
        whatsapp_number = COALESCE(?, whatsapp_number),
        email = COALESCE(?, email),
        address = COALESCE(?, address),
        google_maps_url = COALESCE(?, google_maps_url),
        check_in_time = COALESCE(?, check_in_time),
        check_out_time = COALESCE(?, check_out_time),
        cancellation_policy = COALESCE(?, cancellation_policy)
       WHERE resort_id = ?`,
      [phone, whatsapp_number, email, address, google_maps_url, check_in_time, check_out_time, cancellation_policy, req.tenantResortId]
    );

    res.json({ message: 'Contact details updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update contact details' });
  }
});

export default router;
