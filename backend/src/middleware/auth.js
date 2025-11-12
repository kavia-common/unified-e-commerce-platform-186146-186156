'use strict';
const { verifyToken } = require('../utils/jwt');
const models = require('../models');

/**
 * Middleware to authenticate users using Bearer JWT.
 */

// PUBLIC_INTERFACE
function auth(req, res, next) {
  /** Authenticate the request using Authorization: Bearer <token> */
  try {
    const hdr = req.headers.authorization || '';
    const [scheme, token] = hdr.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = verifyToken(token);
    const user = models.Users.byId(decoded.sub);
    if (!user || user.active === false) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = { id: user.id, email: user.email, role: user.role || 'user', name: user.name || '' };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// PUBLIC_INTERFACE
function adminOnly(req, res, next) {
  /** Restrict route to admin role */
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
}

module.exports = { auth, adminOnly };
