'use strict';
const express = require('express');
const controller = require('../controllers/cart');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart for authenticated users
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
router.get('/', auth, controller.get.bind(controller));

/**
 * @swagger
 * /api/cart:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/', auth, controller.add.bind(controller));

/**
 * @swagger
 * /api/cart/{lineId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update a cart line quantity
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 */
router.put('/:lineId', auth, controller.updateLine.bind(controller));

/**
 * @swagger
 * /api/cart/{lineId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove a cart line
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.delete('/:lineId', auth, controller.removeLine.bind(controller));

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear cart
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 */
router.delete('/', auth, controller.clear.bind(controller));

module.exports = router;
