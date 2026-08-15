import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Use memory storage so uploaded images are converted into permanent Data URLs stored directly in database, immune to container restarts
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed: JPG, PNG, WebP, GIF, SVG'));
    }
  }
});

// POST /api/upload - Single image upload (Encodes as permanent Data URL)
router.post('/', authenticateToken, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const mime = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64}`;
    res.json({ url: dataUrl, filename: req.file.originalname });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process image upload' });
  }
});

// POST /api/upload/multiple - Multiple images upload
router.post('/multiple', authenticateToken, upload.array('files', 10), (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const dataUrls = files.map(f => {
      const mime = f.mimetype;
      const base64 = f.buffer.toString('base64');
      return `data:${mime};base64,${base64}`;
    });
    res.json({ urls: dataUrls });
  } catch (err: any) {
    console.error('Multiple upload error:', err);
    res.status(500).json({ error: 'Failed to process image uploads' });
  }
});

export default router;
