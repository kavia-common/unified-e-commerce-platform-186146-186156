'use strict';
const express = require('express');
const controller = require('../controllers/orders');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order placement and management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order from cart
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       201: { description: Created }
 */
router.post('/', auth, controller.create.bind(controller));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: List current user's orders
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', auth, controller.listMine.bind(controller));

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     tags: [Admin]
 *     summary: Admin list all orders
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
router.get('/admin', auth, adminOnly, controller.adminList.bind(controller));

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Admin update order status
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
router.patch('/admin/:id', auth, adminOnly, controller.adminUpdateStatus.bind(controller));

module.exports = router;
