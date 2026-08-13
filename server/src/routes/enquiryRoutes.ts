import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/enquiries - List all guest enquiries
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    let enquiries;

    if (req.user?.role === 'SUPER_ADMIN' && !req.headers['x-target-resort-id'] && !req.query.resortId) {
      // Super Admin sees enquiries across ALL resorts
      enquiries = await db.all(`
        SELECT e.*, r.name as resort_name
        FROM enquiries e
        LEFT JOIN resorts r ON e.resort_id = r.id
        ORDER BY e.created_at DESC
      `);
    } else {
      // Filter by tenant resort ID
      enquiries = await db.all(`
        SELECT e.*, r.name as resort_name
        FROM enquiries e
        LEFT JOIN resorts r ON e.resort_id = r.id
        WHERE e.resort_id = ?
        ORDER BY e.created_at DESC
      `, [req.tenantResortId]);
    }

    res.json(enquiries);
  } catch (err: any) {
    console.error('Fetch enquiries error:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// PUT /api/enquiries/:id - Update status or notes
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, admin_notes } = req.body;
    const db = await getDb();

    if (req.user?.role === 'SUPER_ADMIN') {
      await db.run(
        `UPDATE enquiries SET
          status = COALESCE(?, status),
          admin_notes = COALESCE(?, admin_notes)
         WHERE id = ?`,
        [status, admin_notes, req.params.id]
      );
    } else {
      await db.run(
        `UPDATE enquiries SET
          status = COALESCE(?, status),
          admin_notes = COALESCE(?, admin_notes)
         WHERE id = ? AND resort_id = ?`,
        [status, admin_notes, req.params.id, req.tenantResortId]
      );
    }

    res.json({ message: 'Enquiry updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// DELETE /api/enquiries/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    if (req.user?.role === 'SUPER_ADMIN') {
      await db.run('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    } else {
      await db.run('DELETE FROM enquiries WHERE id = ? AND resort_id = ?', [req.params.id, req.tenantResortId]);
    }
    res.json({ message: 'Enquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
