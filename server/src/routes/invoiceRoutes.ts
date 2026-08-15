import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/invoices - Fetch invoices
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    let invoices;

    if (req.user?.role === 'SUPER_ADMIN' && !req.headers['x-target-resort-id'] && !req.query.resortId) {
      invoices = await db.all(`
        SELECT i.*, r.name as resort_name, r.custom_domain
        FROM invoices i
        LEFT JOIN resorts r ON i.resort_id = r.id
        ORDER BY i.created_at DESC
      `);
    } else {
      invoices = await db.all(`
        SELECT i.*, r.name as resort_name, r.custom_domain
        FROM invoices i
        LEFT JOIN resorts r ON i.resort_id = r.id
        WHERE i.resort_id = ?
        ORDER BY i.created_at DESC
      `, [req.tenantResortId]);
    }

    res.json(invoices);
  } catch (err: any) {
    console.error('Fetch invoices error:', err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// POST /api/invoices - Create new booking invoice
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      guest_name, guest_email, guest_phone, room_name,
      check_in_date, check_out_date, num_nights, rate_per_night,
      additional_charges, tax_amount, discount_amount, payment_status, payment_method, notes
    } = req.body;

    if (!guest_name) {
      return res.status(400).json({ error: 'Guest name is required' });
    }

    const db = await getDb();
    const resortId = req.tenantResortId;

    // Generate unique invoice number e.g. INV-LEX-2026-8492
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    const invoiceNumber = `INV-${datePrefix}-${randomCode}`;

    const nights = parseInt(num_nights) || 1;
    const rate = parseFloat(rate_per_night) || 0;
    const addl = parseFloat(additional_charges) || 0;
    const tax = parseFloat(tax_amount) || 0;
    const disc = parseFloat(discount_amount) || 0;
    const calculatedTotal = Math.max(0, (nights * rate) + addl + tax - disc);

    const id = uuidv4();
    await db.run(
      `INSERT INTO invoices (
        id, resort_id, invoice_number, guest_name, guest_email, guest_phone, room_name,
        check_in_date, check_out_date, num_nights, rate_per_night, additional_charges,
        tax_amount, discount_amount, total_amount, payment_status, payment_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, resortId, invoiceNumber, guest_name, guest_email || null, guest_phone || null, room_name || 'Serviced Villa Stay',
        check_in_date || null, check_out_date || null, nights, rate, addl,
        tax, disc, calculatedTotal, payment_status || 'PENDING', payment_method || 'UPI / GPay', notes || null
      ]
    );

    res.status(201).json({ message: 'Invoice generated successfully', id, invoice_number: invoiceNumber });
  } catch (err: any) {
    console.error('Create invoice error:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// PUT /api/invoices/:id - Update invoice status or details
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { payment_status, payment_method, notes, rate_per_night, num_nights, additional_charges, tax_amount, discount_amount } = req.body;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const nights = num_nights !== undefined ? parseInt(num_nights) : existing.num_nights;
    const rate = rate_per_night !== undefined ? parseFloat(rate_per_night) : existing.rate_per_night;
    const addl = additional_charges !== undefined ? parseFloat(additional_charges) : existing.additional_charges;
    const tax = tax_amount !== undefined ? parseFloat(tax_amount) : existing.tax_amount;
    const disc = discount_amount !== undefined ? parseFloat(discount_amount) : existing.discount_amount;
    const newTotal = Math.max(0, (nights * rate) + addl + tax - disc);

    await db.run(
      `UPDATE invoices SET
        payment_status = COALESCE(?, payment_status),
        payment_method = COALESCE(?, payment_method),
        notes = COALESCE(?, notes),
        num_nights = ?,
        rate_per_night = ?,
        additional_charges = ?,
        tax_amount = ?,
        discount_amount = ?,
        total_amount = ?
       WHERE id = ?`,
      [payment_status, payment_method, notes, nights, rate, addl, tax, disc, newTotal, req.params.id]
    );

    res.json({ message: 'Invoice updated successfully' });
  } catch (err: any) {
    console.error('Update invoice error:', err);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    await db.run('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
