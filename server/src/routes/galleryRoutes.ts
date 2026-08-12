import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/gallery
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const categories = await db.all('SELECT * FROM gallery_categories WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    const images = await db.all('SELECT * FROM gallery_images WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    res.json({ categories, images });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST /api/gallery/categories
router.post('/categories', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
    const db = await getDb();
    const id = uuidv4();
    await db.run('INSERT INTO gallery_categories (id, resort_id, name) VALUES (?, ?, ?)', [id, req.tenantResortId, name.trim()]);
    res.status(201).json({ message: 'Category created', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// DELETE /api/gallery/categories/:id
router.delete('/categories/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM gallery_categories WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// POST /api/gallery/images
router.post('/images', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image_url, category_id, title, alt_text } = req.body;
    if (!image_url) return res.status(400).json({ error: 'Image URL required' });
    const db = await getDb();
    const id = uuidv4();
    await db.run(
      'INSERT INTO gallery_images (id, resort_id, category_id, image_url, title, alt_text) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.tenantResortId, category_id || null, image_url, title || null, alt_text || null]
    );
    res.status(201).json({ message: 'Image uploaded to gallery', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

// DELETE /api/gallery/images/:id
router.delete('/images/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM gallery_images WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Image deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
