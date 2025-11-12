# unified-e-commerce-platform-186146-186156

## Backend storage and seeding

The backend includes a lightweight storage layer that supports two modes:

- memory (default): keeps data only in process memory (resets on restart)
- file: snapshots collections to JSON files for persistence between restarts

Configure via environment variables:
- DATA_PERSIST = memory | file (default: memory)
- DATA_DIR = directory path for JSON snapshots when using file mode (default: ./data)

On first boot, the service seeds:
- a small catalog of demo products
- one admin user (email: admin@example.com, passwordHash: demo-hash)

Note: Authentication is not implemented yet; passwordHash is a placeholder for demo only.