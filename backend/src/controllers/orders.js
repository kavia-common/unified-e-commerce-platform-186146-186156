'use strict';
const models = require('../models');

class OrdersController {
  // PUBLIC_INTERFACE
  create(req, res) {
    /** Create an order from the current user's cart */
    const order = models.Orders.createFromCart(req.user.id);
    return res.status(201).json(order);
  }

  // PUBLIC_INTERFACE
  listMine(req, res) {
    /** List orders for current user */
    const all = models.Orders.all();
    const mine = all.filter((o) => o.userId === req.user.id);
    return res.json(mine);
  }

  // PUBLIC_INTERFACE
  adminList(req, res) {
    /** Admin: list all orders */
    return res.json(models.Orders.all());
  }

  // PUBLIC_INTERFACE
  adminUpdateStatus(req, res) {
    /** Admin: update order status by id */
    const id = req.params.id;
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required' });
    const updated = models.Orders.updateStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  }
}

module.exports = new OrdersController();
