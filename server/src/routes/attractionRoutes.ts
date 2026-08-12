import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/attractions
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const attractions = await db.all('SELECT * FROM attractions WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    res.json(attractions);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch attractions' });
  }
});

// POST /api/attractions
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, distance, travel_time, image_url, google_maps_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO attractions (id, resort_id, name, description, distance, travel_time, image_url, google_maps_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.tenantResortId, name, description || null, distance || null, travel_time || null, image_url || null, google_maps_url || null]
    );
    res.status(201).json({ message: 'Attraction created', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create attraction' });
  }
});

// DELETE /api/attractions/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM attractions WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Attraction deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete attraction' });
  }
});

export default router;
