import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { getDb } from '../db';

/**
 * Middleware for Public APIs: Resolves resort by hostname, custom domain, X-Resort-ID header, or query param
 */
export async function resolvePublicTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const db = await getDb();
  
  // 1. Explicit query parameter (e.g. ?resort=grand-royal or ?resortId=123)
  const queryResort = (req.query.resort || req.query.resortId) as string;
  if (queryResort) {
    const resort = await db.get(
      'SELECT * FROM resorts WHERE slug = ? OR id = ? OR custom_domain = ?',
      [queryResort, queryResort, queryResort]
    );
    if (resort) {
      req.tenantResortId = resort.id;
      return next();
    }
  }

  // 2. Custom header
  const headerResortId = req.headers['x-resort-id'] as string;
  const headerDomain = req.headers['x-resort-domain'] as string;
  if (headerResortId) {
    req.tenantResortId = headerResortId;
    return next();
  }
  if (headerDomain) {
    const resort = await db.get('SELECT * FROM resorts WHERE custom_domain = ? OR slug = ?', [headerDomain, headerDomain]);
    if (resort) {
      req.tenantResortId = resort.id;
      return next();
    }
  }

  // 3. Host / Domain header resolution (e.g., grandroyal.local or custom domain)
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    const resort = await db.get('SELECT * FROM resorts WHERE custom_domain = ? OR slug = ?', [host, host]);
    if (resort) {
      req.tenantResortId = resort.id;
      return next();
    }
  }

  // Fallback to first active resort if in dev local testing
  const fallbackResort = await db.get('SELECT * FROM resorts WHERE status = "active" ORDER BY created_at ASC LIMIT 1');
  if (fallbackResort) {
    req.tenantResortId = fallbackResort.id;
    return next();
  }

  return res.status(444).json({ error: 'Resort tenant not found' });
}

/**
 * Middleware for Protected Admin APIs: Ensures RESORT_ADMIN can ONLY access their assigned resort
 */
export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role === 'SUPER_ADMIN') {
    // Super admin can specify target resort via header or query, or default to header/query
    const targetResortId = (req.headers['x-target-resort-id'] || req.query.resortId) as string;
    if (targetResortId) {
      req.tenantResortId = targetResortId;
    } else {
      req.tenantResortId = req.user.resort_id || undefined;
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
