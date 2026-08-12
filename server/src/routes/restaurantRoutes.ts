import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/restaurant/items
router.get('/items', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const items = await db.all('SELECT * FROM restaurant_items WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    const settings = await db.get('SELECT restaurant_enabled FROM website_settings WHERE resort_id = ?', [req.tenantResortId]);
    res.json({ enabled: settings ? settings.restaurant_enabled === 1 : true, items });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch restaurant items' });
  }
});

// POST /api/restaurant/toggle - Enable/Disable Restaurant section
router.post('/toggle', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { enabled } = req.body;
    const db = await getDb();
    await db.run(
      'UPDATE website_settings SET restaurant_enabled = ? WHERE resort_id = ?',
      [enabled ? 1 : 0, req.tenantResortId]
    );
    res.json({ message: 'Restaurant section state updated', enabled });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle restaurant status' });
  }
});

// POST /api/restaurant/items
router.post('/items', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category, description, price, image_url, is_vegetarian } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name required' });
    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO restaurant_items (id, resort_id, name, category, description, price, image_url, is_vegetarian, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, req.tenantResortId, name, category || 'General', description || null, price || 0, image_url || null, is_vegetarian ? 1 : 0]
    );
    res.status(201).json({ message: 'Restaurant item added', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// DELETE /api/restaurant/items/:id
router.delete('/items/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM restaurant_items WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Menu item deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;
