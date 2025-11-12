const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'REST API for e-commerce app with auth, products, cart, and orders',
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 3001) },
    ],
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'Authentication' },
      { name: 'Products', description: 'Product browsing and management' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Orders', description: 'Order operations' },
      { name: 'Admin', description: 'Admin-only operations' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
