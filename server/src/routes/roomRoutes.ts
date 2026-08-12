import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenant';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.use(authenticateToken);
router.use(enforceTenantIsolation);

// GET /api/rooms - List all rooms for tenant
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const resortId = req.tenantResortId;
    const db = await getDb();

    const roomsRaw = await db.all(
      'SELECT * FROM rooms WHERE resort_id = ? ORDER BY display_order ASC, created_at DESC',
      [resortId]
    );

    const rooms = [];
    for (const r of roomsRaw) {
      const images = await db.all('SELECT * FROM room_images WHERE room_id = ? ORDER BY display_order ASC', [r.id]);
      const amenities = await db.all(
        `SELECT a.* FROM amenities a JOIN room_amenities ra ON a.id = ra.amenity_id WHERE ra.room_id = ?`,
        [r.id]
      );
      rooms.push({ ...r, images, amenities });
    }

    res.json(rooms);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// POST /api/rooms - Create a new room
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const resortId = req.tenantResortId;
    const {
      name, description, short_description, price, discounted_price,
      max_occupancy, bed_type, room_size, primary_image, amenity_ids, images
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Room name and price are required' });
    }

    const db = await getDb();
    const roomId = uuidv4();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await db.run(
      `INSERT INTO rooms (
        id, resort_id, name, slug, description, short_description, price, discounted_price,
        max_occupancy, bed_type, room_size, primary_image, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        roomId, resortId, name.trim(), slug, description || null, short_description || null,
        price, discounted_price || null, max_occupancy || null, bed_type || null, room_size || null,
        primary_image || null
      ]
    );

    // Link amenities
    if (Array.isArray(amenity_ids)) {
      for (const aId of amenity_ids) {
        await db.run('INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)', [roomId, aId]);
      }
    }

    // Add extra room images
    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url;
        await db.run(
          'INSERT INTO room_images (id, room_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [uuidv4(), roomId, imgUrl, i + 1]
        );
      }
    }

    res.status(201).json({ message: 'Room created successfully', id: roomId });
  } catch (err: any) {
    console.error('Create room error:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// PUT /api/rooms/:id - Update room
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resortId = req.tenantResortId;
    const {
      name, description, short_description, price, discounted_price,
      max_occupancy, bed_type, room_size, primary_image, is_active, amenity_ids, images
    } = req.body;

    const db = await getDb();

    // Verify room belongs to tenant
    const room = await db.get('SELECT id FROM rooms WHERE id = ? AND resort_id = ?', [id, resortId]);
    if (!room) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;

    await db.run(
      `UPDATE rooms SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = ?,
        short_description = ?,
        price = COALESCE(?, price),
        discounted_price = ?,
        max_occupancy = ?,
        bed_type = ?,
        room_size = ?,
        primary_image = ?,
        is_active = COALESCE(?, is_active)
      WHERE id = ? AND resort_id = ?`,
      [
        name, slug, description, short_description, price, discounted_price,
        max_occupancy, bed_type, room_size, primary_image, is_active !== undefined ? (is_active ? 1 : 0) : 1,
        id, resortId
      ]
    );

    // Update amenities if provided
    if (Array.isArray(amenity_ids)) {
      await db.run('DELETE FROM room_amenities WHERE room_id = ?', [id]);
      for (const aId of amenity_ids) {
        await db.run('INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)', [id, aId]);
      }
    }

    // Update images if provided
    if (Array.isArray(images)) {
      await db.run('DELETE FROM room_images WHERE room_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url;
        await db.run(
          'INSERT INTO room_images (id, room_id, image_url, display_order) VALUES (?, ?, ?, ?)',
          [uuidv4(), id, imgUrl, i + 1]
        );
      }
    }

    res.json({ message: 'Room updated successfully' });
  } catch (err: any) {
    console.error('Update room error:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const resortId = req.tenantResortId;
    const db = await getDb();

    const room = await db.get('SELECT id FROM rooms WHERE id = ? AND resort_id = ?', [id, resortId]);
    if (!room) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    await db.run('DELETE FROM rooms WHERE id = ? AND resort_id = ?', [id, resortId]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
