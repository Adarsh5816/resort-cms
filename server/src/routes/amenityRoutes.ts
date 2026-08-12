import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/amenities
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const amenities = await db.all(
      'SELECT * FROM amenities WHERE resort_id = ? ORDER BY display_order ASC, name ASC',
      [req.tenantResortId]
    );
    res.json(amenities);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

// POST /api/amenities
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, icon_name, description, is_featured } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Amenity name is required' });
    }

    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO amenities (id, resort_id, name, icon_name, description, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [id, req.tenantResortId, name.trim(), icon_name || 'check', description || null, is_featured ? 1 : 0]
    );

    res.status(201).json({ message: 'Amenity created', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create amenity' });
  }
});

// PUT /api/amenities/:id
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon_name, description, is_featured, is_active } = req.body;

    const db = await getDb();
    await db.run(
      `UPDATE amenities SET
        name = COALESCE(?, name),
        icon_name = COALESCE(?, icon_name),
        description = ?,
        is_featured = COALESCE(?, is_featured),
        is_active = COALESCE(?, is_active)
       WHERE id = ? AND resort_id = ?`,
      [
        name, icon_name, description,
        is_featured !== undefined ? (is_featured ? 1 : 0) : undefined,
        is_active !== undefined ? (is_active ? 1 : 0) : undefined,
        id, req.tenantResortId
      ]
    );

    res.json({ message: 'Amenity updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update amenity' });
  }
});

// DELETE /api/amenities/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM amenities WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Amenity deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete amenity' });
  }
});

export default router;
