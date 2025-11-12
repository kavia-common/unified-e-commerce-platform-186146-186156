require('dotenv').config();
const app = require('./app');
const storage = require('./services/storage');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize storage before starting server
(async () => {
  try {
    await storage.init();
  } catch (err) {
    console.error('Failed to initialize storage:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(
      `Storage mode: ${storage.getMode()} | Data dir: ${storage.getDataDir()}`
    );
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    try {
      await storage.shutdown();
    } catch (e) {
      console.error('Error during storage shutdown:', e);
    }
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  module.exports = server;
})();
