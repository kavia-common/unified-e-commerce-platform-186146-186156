'use strict';
const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/admin');
const productsController = require('../controllers/products');
const ordersController = require('../controllers/orders');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
router.get('/users', auth, adminOnly, adminController.listUsers.bind(adminController));

// Mirror admin product routes under /api/admin/products to match frontend
/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Create product
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       201: { description: Created }
 */
router.post('/products', auth, adminOnly, productsController.adminCreate.bind(productsController));

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update product
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.put('/products/:id', auth, adminOnly, productsController.adminUpdate.bind(productsController));

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete product
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: No Content }
 *       404: { description: Not found }
 */
router.delete('/products/:id', auth, adminOnly, productsController.adminRemove.bind(productsController));

// Mirror admin orders routes under /api/admin/orders
/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: List all orders
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
router.get('/orders', auth, adminOnly, ordersController.adminList.bind(ordersController));

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Update order status
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.patch('/orders/:id', auth, adminOnly, ordersController.adminUpdateStatus.bind(ordersController));

module.exports = router;
