# unified-e-commerce-platform-186146-186156

## Backend storage and seeding

The backend includes a lightweight storage layer that supports two modes:

- memory (default): keeps data only in process memory (resets on restart)
- file: snapshots collections to JSON files for persistence between restarts

Configure via environment variables:
- DATA_PERSIST = memory | file (default: memory)
- DATA_DIR = directory path for JSON snapshots when using file mode (default: ./data)
- PORT = backend port (default: 3001)
- JWT_SECRET = secret used for signing JWTs
- REACT_APP_FRONTEND_URL = CORS allowed origin
- REACT_APP_LOG_LEVEL = set to 'silent' to disable request logs

On first boot, the service seeds:
- a small catalog of demo products
- one admin user (email: admin@example.com, password: admin)

API routes are available under /api/* with Swagger docs at /docs.