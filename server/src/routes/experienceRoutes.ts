import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/experiences
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const experiences = await db.all('SELECT * FROM experiences WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    res.json(experiences);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// POST /api/experiences
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, image_url, price, duration, location } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO experiences (id, resort_id, title, description, image_url, price, duration, location, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, req.tenantResortId, title, description || null, image_url || null, price || null, duration || null, location || null]
    );
    res.status(201).json({ message: 'Experience created', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

// PUT /api/experiences/:id
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, image_url, price, duration, location, is_active } = req.body;
    const db = await getDb();
    await db.run(
      `UPDATE experiences SET
        title = COALESCE(?, title),
        description = ?,
        image_url = ?,
        price = ?,
        duration = ?,
        location = ?,
        is_active = COALESCE(?, is_active)
       WHERE id = ? AND resort_id = ?`,
      [title, description, image_url, price, duration, location, is_active !== undefined ? (is_active ? 1 : 0) : 1, req.params.id, req.tenantResortId]
    );
    res.json({ message: 'Experience updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// DELETE /api/experiences/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM experiences WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Experience deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
