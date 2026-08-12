import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/testimonials
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const testimonials = await db.all('SELECT * FROM testimonials WHERE resort_id = ? ORDER BY display_order ASC', [req.tenantResortId]);
    res.json(testimonials);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST /api/testimonials
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customer_name, location_or_title, rating, review_text, avatar_url, review_date } = req.body;
    if (!customer_name || !review_text) {
      return res.status(400).json({ error: 'Customer name and review text are required' });
    }
    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO testimonials (id, resort_id, customer_name, location_or_title, rating, review_text, avatar_url, review_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, req.tenantResortId, customer_name, location_or_title || null, rating || 5, review_text, avatar_url || null, review_date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ message: 'Testimonial added', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// DELETE /api/testimonials/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM testimonials WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    res.json({ message: 'Testimonial deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
