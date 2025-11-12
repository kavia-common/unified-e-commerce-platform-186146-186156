const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const morgan = require('morgan');

// Initialize express app
const app = express();

// CORS: allow REACT_APP_FRONTEND_URL or default localhost:3000
const allowedOrigin = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin or no-origin (curl/postman)
    if (!origin) return callback(null, true);
    // Allow exact match and common localhost variants
    const ok = [allowedOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'].includes(origin);
    if (ok) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Conditional request logging based on REACT_APP_LOG_LEVEL
if ((process.env.REACT_APP_LOG_LEVEL || '').toLowerCase() !== 'silent') {
  app.use(morgan('dev'));
}
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
