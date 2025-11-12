'use strict';
const models = require('../models');
const v = require('../utils/validators');

class CartController {
  // PUBLIC_INTERFACE
  get(req, res) {
    /** Get current user's cart */
    const cart = models.Carts.getOrCreateByUser(req.user.id);
    return res.json(cart);
  }

  // PUBLIC_INTERFACE
  add(req, res) {
    /** Add item to cart */
    const { error, value } = v.validateCartAdd(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Ensure product exists and is active
    const prod = models.Products.byId(value.productId);
    if (!prod || prod.active === false) return res.status(404).json({ error: 'Product not found' });

    const updated = models.Carts.addItem(req.user.id, value.productId, value.qty);
    return res.status(201).json(updated);
  }

  // PUBLIC_INTERFACE
  updateLine(req, res) {
    /** Update quantity for a cart line (by productId as lineId) */
    const { error, value } = v.validateCartUpdate(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });

    const cart = models.Carts.getOrCreateByUser(req.user.id);
    const lineId = req.params.lineId;
    const exists = cart.items.find((i) => i.productId === lineId);
    if (!exists) return res.status(404).json({ error: 'Line not found' });

    exists.qty = value.qty;
    const saved = require('../services/storage').carts().update(cart.id, { items: cart.items });
    return res.json(saved);
  }

  // PUBLIC_INTERFACE
  removeLine(req, res) {
    /** Remove a line from cart (by productId as lineId) */
    const lineId = req.params.lineId;
    const updated = models.Carts.removeItem(req.user.id, lineId);
    return res.json(updated);
  }

  // PUBLIC_INTERFACE
  clear(req, res) {
    /** Clear the cart */
    const cleared = models.Carts.clear(req.user.id);
    return res.json(cleared);
  }
}

module.exports = new CartController();
