'use strict';
const models = require('../models');
const v = require('../utils/validators');

class ProductsController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** List all active products */
    const list = models.Products.all();
    return res.json(list);
  }

  // PUBLIC_INTERFACE
  get(req, res) {
    /** Get a product by id */
    const prod = models.Products.byId(req.params.id);
    if (!prod || prod.active === false) return res.status(404).json({ error: 'Not found' });
    return res.json(prod);
  }

  // PUBLIC_INTERFACE
  adminCreate(req, res) {
    /** Admin: create product */
    const { error, value } = v.validateProductCreate(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });
    const created = models.Products.create(value);
    return res.status(201).json(created);
  }

  // PUBLIC_INTERFACE
  adminUpdate(req, res) {
    /** Admin: update product */
    const { error, value } = v.validateProductUpdate(req.body || {});
    if (error) return res.status(400).json({ error: error.details[0].message });
    const updated = models.Products.update(req.params.id, value);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  }

  // PUBLIC_INTERFACE
  adminRemove(req, res) {
    /** Admin: delete product */
    const ok = models.Products.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    return res.status(204).send();
  }
}

module.exports = new ProductsController();
