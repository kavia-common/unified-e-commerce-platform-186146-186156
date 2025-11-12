'use strict';
const models = require('../models');

class AdminController {
  // PUBLIC_INTERFACE
  listUsers(req, res) {
    /** Admin: list all users */
    const users = models.Users.all().map(u => ({ id: u.id, email: u.email, role: u.role || 'user', name: u.name || '', active: u.active !== false }));
    return res.json(users);
  }
}

module.exports = new AdminController();
