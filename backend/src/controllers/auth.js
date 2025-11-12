'use strict';
const bcrypt = require('bcryptjs');
const models = require('../models');
const { signToken } = require('../utils/jwt');
const v = require('../utils/validators');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res) {
    /** Register a new user */
    const { error, value } = v.validateRegister(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existing = models.Users.byEmail(value.email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(value.password, 10);
    const user = models.Users.create({
      email: value.email,
      name: value.name || '',
      role: 'user',
      active: true,
      passwordHash,
    });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /** Login user and issue JWT */
    const { error, value } = v.validateLogin(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = models.Users.byEmail(value.email);
    if (!user || user.active === false) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If seed user has 'demo-hash', accept 'admin' as password for demo
    let valid = false;
    if (user.passwordHash === 'demo-hash') {
      valid = value.password === 'admin';
    } else {
      valid = await bcrypt.compare(value.password, user.passwordHash || '');
    }
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role || 'user' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role || 'user', name: user.name || '' } });
  }

  // PUBLIC_INTERFACE
  async me(req, res) {
    /** Return current user profile */
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = models.Users.byId(req.user.id);
    return res.json({ id: user.id, email: user.email, role: user.role || 'user', name: user.name || '' });
  }
}

module.exports = new AuthController();
