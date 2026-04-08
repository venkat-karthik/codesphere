import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = createDOMPurify(window as any);

// Robust sanitizer — uses DOMPurify to strip malicious scripts while allowing safe HTML
export function sanitize(val: unknown): unknown {
  if (typeof val === 'string') {
    return purify.sanitize(val).trim();
  }
  if (Array.isArray(val)) return val.map(sanitize);
  if (val && typeof val === 'object' && !(val instanceof Date)) {
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, sanitize(v)]));
  }
  return val;
}

// Middleware: sanitize all request body fields
export function sanitizeBody(req: Request, _res: Response, next: NextFunction) {
  if (req.body) req.body = sanitize(req.body);
  next();
}

// Middleware: require authenticated session
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

// Middleware: require admin role (full admin only)
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

// Middleware: require sub-admin or admin role (for content management)
export function requireSubAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const role = req.session.userRole;
  if (role !== 'admin' && role !== 'sub_admin') {
    return res.status(403).json({ message: "Forbidden — requires admin or sub-admin access" });
  }
  next();
}

// Middleware: require paid subscription (premium or pro)
export async function requireSubscription(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
  // Admins bypass subscription check
  if (req.session.userRole === 'admin') return next();
  
  const user = await storage.getUser(req.session.userId);
  if (!user) return res.status(401).json({ message: "User not found" });

  // Demo accounts bypass subscription check
  if (user.email === 'admin@codesphere.com' || user.email === 'student@codesphere.com') return next();
  
  const sub = user.subscriptionType;
  const expiry = (user as any).subscriptionExpiry;
  const isActive = (sub === 'premium' || sub === 'pro') && (!expiry || new Date(expiry) > new Date());
  
  if (!isActive) {
    return res.status(402).json({ 
      message: "This feature requires a Pro or Premium subscription.", 
      upgradeRequired: true 
    });
  }
  next();
}
