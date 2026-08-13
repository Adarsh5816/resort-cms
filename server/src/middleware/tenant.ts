import { Request, Response, NextFunction } from 'express';
import { getDb } from '../db';
import { AuthenticatedRequest } from './auth';

/**
 * Middleware for Public APIs: Resolves resort tenant ID from hostname or query string (?resort=slug)
 */
export async function resolvePublicTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const db = await getDb();
  const queryResort = (req.query.resort || req.query.resortId) as string;

  // 1. Check query parameter e.g. ?resort=lexur-green
  if (queryResort) {
    const resort = await db.get(
      'SELECT * FROM resorts WHERE slug = ? OR id = ? OR custom_domain = ?',
      [queryResort.toLowerCase().trim(), queryResort, queryResort.toLowerCase().trim()]
    );
    if (resort) {
      req.tenantResortId = resort.id;
      return next();
    }
  }

  // 2. Check Host header (e.g. www.lexurbooking.in)
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    const resort = await db.get('SELECT * FROM resorts WHERE custom_domain = ? OR slug = ?', [host, host]);
    if (resort) {
      req.tenantResortId = resort.id;
      return next();
    }
  }

  // 3. Fallback to primary active resort (Lexur Green)
  const fallbackResort = await db.get('SELECT * FROM resorts WHERE status = "active" ORDER BY created_at ASC LIMIT 1');
  if (fallbackResort) {
    req.tenantResortId = fallbackResort.id;
    return next();
  }

  return res.status(444).json({ error: 'Resort tenant not found' });
}

/**
 * Middleware for Protected Admin APIs: Ensures RESORT_ADMIN can ONLY access their assigned resort, while SUPER_ADMIN can view all or target specific resort
 */
export async function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const db = await getDb();

  if (req.user.role === 'SUPER_ADMIN') {
    const targetResortId = (req.headers['x-target-resort-id'] || req.query.resortId) as string;
    if (targetResortId) {
      req.tenantResortId = targetResortId;
    } else if (req.user.resort_id) {
      req.tenantResortId = req.user.resort_id;
    } else {
      // Default Super Admin to first active resort (Lexur Green) for tenant-bound views
      const defaultResort = await db.get('SELECT id FROM resorts WHERE status = "active" ORDER BY created_at ASC LIMIT 1');
      if (defaultResort) {
        req.tenantResortId = defaultResort.id;
      }
    }
    return next();
  }

  // RESORT_ADMIN is strictly bound to user.resort_id
  if (!req.user.resort_id) {
    return res.status(403).json({ error: 'Resort Admin has no assigned resort' });
  }

  req.tenantResortId = req.user.resort_id;

  // Prevent spoofing attempts
  const targetId = (req.params.resortId || req.body.resort_id || req.query.resortId) as string;
  if (targetId && targetId !== req.user.resort_id) {
    return res.status(403).json({ error: 'Access denied: Cannot access another resort data' });
  }

  next();
}
