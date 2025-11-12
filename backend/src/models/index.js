'use strict';
const storage = require('../services/storage');

/**
 * Domain model helpers that wrap storage collections and provide convenience methods
 * for products, users, orders, and carts. These are intentionally thin abstractions
 * over the storage layer to keep the demo simple.
 */

const Products = {
  // PUBLIC_INTERFACE
  all() {
    /** Return all active products. */
    return storage.products().findAll((p) => p.active !== false);
  },
  // PUBLIC_INTERFACE
  byId(id) {
    /** Return a single product by id or null. */
    return storage.products().findById(id);
  },
  // PUBLIC_INTERFACE
  create(data) {
    /** Create a new product (no validation for demo). */
    return storage.products().create(data);
  },
  // PUBLIC_INTERFACE
  update(id, updates) {
    /** Update product by id. */
    return storage.products().update(id, updates);
  },
  // PUBLIC_INTERFACE
  remove(id) {
    /** Remove product by id. */
    return storage.products().remove(id);
  }
};

const Users = {
  // PUBLIC_INTERFACE
  all() {
    /** Return all users. */
    return storage.users().findAll();
  },
  // PUBLIC_INTERFACE
  byId(id) {
    /** Get user by id. */
    return storage.users().findById(id);
  },
  // PUBLIC_INTERFACE
  byEmail(email) {
    /** Find a user by exact email. */
    return storage.users().findOne({ email });
  },
  // PUBLIC_INTERFACE
  create(data) {
    /** Create a user. For demo, no password hashing performed here. */
    return storage.users().create(data);
  },
  // PUBLIC_INTERFACE
  update(id, updates) {
    /** Update a user by id. */
    return storage.users().update(id, updates);
  }
};

const Carts = {
  // PUBLIC_INTERFACE
  getOrCreateByUser(userId) {
    /** Retrieve a cart for a user or create a new one. */
    let cart = storage.carts().findOne({ userId });
    if (!cart) {
      cart = storage.carts().create({ userId, items: [] });
    }
    return cart;
  },
  // PUBLIC_INTERFACE
  addItem(userId, productId, qty = 1) {
    /** Add item to user's cart (increments quantity if exists). */
    const cart = this.getOrCreateByUser(userId);
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }
    return storage.carts().update(cart.id, { items: cart.items });
  },
  // PUBLIC_INTERFACE
  removeItem(userId, productId) {
    /** Remove item from user's cart. */
    const cart = this.getOrCreateByUser(userId);
    const items = cart.items.filter((i) => i.productId !== productId);
    return storage.carts().update(cart.id, { items });
  },
  // PUBLIC_INTERFACE
  clear(userId) {
    /** Clear the user's cart. */
    const cart = this.getOrCreateByUser(userId);
    return storage.carts().update(cart.id, { items: [] });
  }
};

const Orders = {
  // PUBLIC_INTERFACE
  all() {
    /** Return all orders. */
    return storage.orders().findAll();
  },
  // PUBLIC_INTERFACE
  byId(id) {
    /** Get an order by id. */
    return storage.orders().findById(id);
  },
  // PUBLIC_INTERFACE
  createFromCart(userId) {
    /** Create an order using the current cart contents. */
    const cart = Carts.getOrCreateByUser(userId);
    const items = cart.items || [];
    const status = 'pending';
    const order = storage.orders().create({
      userId,
      items,
      status,
      total: items.reduce((sum, it) => {
        const prod = storage.products().findById(it.productId);
        const price = prod ? Number(prod.price) : 0;
        return sum + price * it.qty;
      }, 0)
    });
    // Clear cart after order placed
    Carts.clear(userId);
    return order;
  },
  // PUBLIC_INTERFACE
  updateStatus(id, status) {
    /** Update the status of an order. */
    return storage.orders().update(id, { status });
  }
};

module.exports = {
  Products,
  Users,
  Carts,
  Orders
};
