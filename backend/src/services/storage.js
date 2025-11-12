'use strict';
const fs = require('fs');
const path = require('path');

/**
 * Simple storage service that can operate in-memory or snapshot to JSON files.
 * Controlled via env:
 * - DATA_PERSIST = 'file' | 'memory' (default 'memory')
 * - DATA_DIR = path to directory when file persistence is used (default './data')
 *
 * Exposes basic CRUD helpers and collection access for: products, users, orders, carts.
 */
class StorageService {
  constructor() {
    this.mode = (process.env.DATA_PERSIST || 'memory').toLowerCase();
    this.dataDir = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');

    // Internal in-memory state
    this.state = {
      products: [],
      users: [],
      orders: [],
      carts: []
    };

    // Track if initialized
    this._initialized = false;
  }

  // PUBLIC_INTERFACE
  async init() {
    /** Initialize storage by loading snapshots if in file mode and seeding defaults if empty. */
    if (this._initialized) return;

    if (this.mode === 'file') {
      await this._ensureDir(this.dataDir);
      await this._loadSnapshots();
    }

    // Seed only if empty
    const needsSeed =
      this.state.products.length === 0 ||
      this.state.users.length === 0;

    if (needsSeed) {
      await this._seed();
      await this._autoSave();
    }

    this._initialized = true;
  }

  // PUBLIC_INTERFACE
  getMode() {
    /** Return the current persistence mode. */
    return this.mode;
  }

  // PUBLIC_INTERFACE
  getDataDir() {
    /** Return the data directory used for snapshots (if applicable). */
    return this.dataDir;
  }

  // PUBLIC_INTERFACE
  async shutdown() {
    /** Flush snapshots if needed. */
    await this._autoSave();
  }

  // Internal: ensure data dir exists
  async _ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true });
  }

  // Internal: load JSON snapshots from data dir (best-effort)
  async _loadSnapshots() {
    const collections = Object.keys(this.state);
    for (const col of collections) {
      const p = path.join(this.dataDir, `${col}.json`);
      try {
        const content = await fs.promises.readFile(p, 'utf8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          this.state[col] = parsed;
        }
      } catch (err) {
        // If file doesn't exist or invalid JSON, skip and continue with defaults
        if (err.code !== 'ENOENT') {
          console.warn(`Warning: could not load snapshot for ${col}:`, err.message);
        }
      }
    }
  }

  // Internal: save snapshots to data dir (only in file mode)
  async _autoSave() {
    if (this.mode !== 'file') return;
    const collections = Object.keys(this.state);
    await Promise.all(
      collections.map(async (col) => {
        const p = path.join(this.dataDir, `${col}.json`);
        const content = JSON.stringify(this.state[col], null, 2);
        await fs.promises.writeFile(p, content, 'utf8');
      })
    );
  }

  // Internal: generate simple unique id
  _id(prefix = 'id') {
    const rnd = Math.random().toString(36).slice(2, 8);
    const ts = Date.now().toString(36);
    return `${prefix}_${ts}${rnd}`;
  }

  // PUBLIC_INTERFACE
  products() {
    /** Get the products collection helpers. */
    return this._collection('products', 'prod');
  }

  // PUBLIC_INTERFACE
  users() {
    /** Get the users collection helpers. */
    return this._collection('users', 'user');
  }

  // PUBLIC_INTERFACE
  orders() {
    /** Get the orders collection helpers. */
    return this._collection('orders', 'ord');
  }

  // PUBLIC_INTERFACE
  carts() {
    /** Get the carts collection helpers. */
    return this._collection('carts', 'cart');
  }

  _collection(name, prefix) {
    const ref = this;
    return {
      // PUBLIC_INTERFACE
      findAll(filterFn = null) {
        /** Return all items, optionally filtered by a predicate function. */
        const list = ref.state[name] || [];
        return filterFn ? list.filter(filterFn) : [...list];
      },
      // PUBLIC_INTERFACE
      findById(id) {
        /** Find an item by its id. */
        return (ref.state[name] || []).find((i) => i.id === id) || null;
      },
      // PUBLIC_INTERFACE
      findOne(where = {}) {
        /** Find first item matching all key-value pairs in 'where'. */
        const list = ref.state[name] || [];
        return list.find((i) => Object.entries(where).every(([k, v]) => i[k] === v)) || null;
      },
      // PUBLIC_INTERFACE
      create(payload) {
        /** Create a new item in the collection and return it. */
        const item = {
          id: ref._id(prefix),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...payload
        };
        ref.state[name].push(item);
        // Fire and forget
        ref._autoSave().catch(() => {});
        return item;
      },
      // PUBLIC_INTERFACE
      update(id, updates) {
        /** Update an item by id with provided updates. Returns updated item or null. */
        const list = ref.state[name];
        const idx = list.findIndex((i) => i.id === id);
        if (idx === -1) return null;
        const updated = {
          ...list[idx],
          ...updates,
          id,
          updatedAt: new Date().toISOString()
        };
        list[idx] = updated;
        ref._autoSave().catch(() => {});
        return updated;
      },
      // PUBLIC_INTERFACE
      remove(id) {
        /** Remove an item by id. Returns true if removed, false otherwise. */
        const list = ref.state[name];
        const lenBefore = list.length;
        ref.state[name] = list.filter((i) => i.id !== id);
        const changed = ref.state[name].length !== lenBefore;
        if (changed) ref._autoSave().catch(() => {});
        return changed;
      }
    };
  }

  // Internal: seed initial data (products and an admin user)
  async _seed() {
    // Products
    if (this.state.products.length === 0) {
      const defaults = [
        {
          name: 'Ocean Breeze T-Shirt',
          sku: 'TSHIRT-OCEAN-001',
          price: 24.99,
          currency: 'USD',
          stock: 100,
          images: ['/assets/products/ocean-breeze-shirt.jpg'],
          description: 'Lightweight cotton tee inspired by ocean vibes.',
          category: 'Apparel',
          tags: ['tshirt', 'ocean', 'casual'],
          active: true
        },
        {
          name: 'Amber Glow Hoodie',
          sku: 'HOODIE-AMBER-002',
          price: 49.99,
          currency: 'USD',
          stock: 60,
          images: ['/assets/products/amber-glow-hoodie.jpg'],
          description: 'Cozy hoodie with amber accent drawstrings.',
          category: 'Apparel',
          tags: ['hoodie', 'amber', 'winter'],
          active: true
        },
        {
          name: 'Waveform Headphones',
          sku: 'AUDIO-WAVE-003',
          price: 89.0,
          currency: 'USD',
          stock: 40,
          images: ['/assets/products/waveform-headphones.jpg'],
          description: 'Crisp audio with comfortable over-ear design.',
          category: 'Electronics',
          tags: ['audio', 'headphones'],
          active: true
        }
      ];
      defaults.forEach((p) => this.products().create(p));
    }

    // Admin User
    if (this.state.users.length === 0) {
      this.users().create({
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin',
        passwordHash: 'demo-hash', // For demo only. Replace with real auth later.
        active: true
      });
    }
  }
}

module.exports = new StorageService();
