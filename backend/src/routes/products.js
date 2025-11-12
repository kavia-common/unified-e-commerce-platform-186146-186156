'use strict';
const express = require('express');
const controller = require('../controllers/products');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product browsing and admin management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List all active products
 *     responses:
 *       200: { description: OK }
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id', controller.get.bind(controller));

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new product
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       403: { description: Forbidden }
 */
router.post('/admin', auth, adminOnly, controller.adminCreate.bind(controller));

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a product
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 */
router.put('/admin/:id', auth, adminOnly, controller.adminUpdate.bind(controller));

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a product
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
router.delete('/admin/:id', auth, adminOnly, controller.adminRemove.bind(controller));

module.exports = router;
