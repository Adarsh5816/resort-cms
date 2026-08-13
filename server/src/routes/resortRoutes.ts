import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['SUPER_ADMIN']));

// GET /api/resorts - Super Admin list all resorts
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const resorts = await db.all(`
      SELECT r.*, t.theme_id, u.email as admin_email, u.name as admin_name
      FROM resorts r
      LEFT JOIN theme_settings t ON r.id = t.resort_id
      LEFT JOIN users u ON r.id = u.resort_id AND u.role = 'RESORT_ADMIN'
      ORDER BY r.created_at DESC
    `);
    res.json(resorts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch resorts' });
  }
});

// POST /api/resorts - Create a new resort tenant
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, slug, custom_domain, theme_id, admin_email, admin_name, admin_password } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Resort name and slug are required' });
    }

    const db = await getDb();

    // Check slug uniqueness
    const existing = await db.get('SELECT id FROM resorts WHERE slug = ?', [slug.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'Slug is already in use by another resort' });
    }

    const resortId = uuidv4();
    await db.run(
      'INSERT INTO resorts (id, name, slug, custom_domain, status) VALUES (?, ?, ?, ?, ?)',
      [resortId, name.trim(), slug.toLowerCase().trim(), custom_domain ? custom_domain.trim() : null, 'active']
    );

    // Initialize Default Website Settings
    await db.run(
      `INSERT INTO website_settings (id, resort_id, tagline, short_description, full_description) 
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), resortId, `Welcome to ${name}`, `Discover luxury and relaxation at ${name}.`, `${name} offers unforgettable hospitality.`]
    );

    // Initialize Default Theme Settings
    await db.run(
      `INSERT INTO theme_settings (id, resort_id, theme_id) VALUES (?, ?, ?)`,
      [uuidv4(), resortId, theme_id || 'luxury-dark']
    );

    // Initialize Default Homepage Sections
    const defaultSections = ['hero', 'about', 'rooms', 'amenities', 'experiences', 'gallery', 'restaurant', 'testimonials', 'contact'];
    for (let i = 0; i < defaultSections.length; i++) {
      await db.run(
        `INSERT INTO homepage_sections (id, resort_id, section_key, title, is_enabled, display_order) 
         VALUES (?, ?, ?, ?, 1, ?)`,
        [uuidv4(), resortId, defaultSections[i], defaultSections[i].toUpperCase(), i + 1]
      );
    }

    // Initialize Default Contact Record
    await db.run(
      `INSERT INTO contact_information (id, resort_id, email) VALUES (?, ?, ?)`,
      [uuidv4(), resortId, admin_email || 'info@resort.com']
    );

    // Create Resort Admin user if specified
    let adminUser = null;
    if (admin_email && admin_password) {
      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(admin_password, 10);
      await db.run(
        `INSERT INTO users (id, email, password_hash, name, role, resort_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, admin_email.toLowerCase().trim(), passwordHash, admin_name || `${name} Admin`, 'RESORT_ADMIN', resortId]
      );
      adminUser = { id: userId, email: admin_email, name: admin_name };
    }

    res.status(201).json({
      message: 'Resort created successfully',
      resort: { id: resortId, name, slug, custom_domain, theme_id: theme_id || 'luxury-dark', adminUser }
    });
  } catch (err: any) {
    console.error('Create resort error:', err);
    res.status(500).json({ error: 'Failed to create resort' });
  }
});

// PUT /api/resorts/:id - Update resort details
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, custom_domain, status, theme_id } = req.body;
    const db = await getDb();

    await db.run(
      'UPDATE resorts SET name = ?, slug = ?, custom_domain = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, slug, custom_domain || null, status || 'active', id]
    );

    if (theme_id) {
      await db.run(
        'UPDATE theme_settings SET theme_id = ? WHERE resort_id = ?',
        [theme_id, id]
      );
    }

    res.json({ message: 'Resort updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update resort' });
  }
});

// DELETE /api/resorts/:id - Delete resort tenant
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM resorts WHERE id = ?', [id]);
    res.json({ message: 'Resort deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete resort' });
  }
});

export default router;
