# E2E Verification Checklist

Prereqs:
- Backend: `cd backend && npm install && npm run dev` (or `npm start`) — ensure .env has PORT=3001, JWT_SECRET set.
- Frontend: `cd ../unified-e-commerce-platform-186146-186155/frontend && npm install && npm start` — ensure .env has REACT_APP_API_BASE=http://localhost:3001/api.

Endpoints:
- Backend docs: http://localhost:3001/docs
- Frontend app: http://localhost:3000/

Checklist:
1) Products
   - Home page loads and shows products: GET /api/products
   - Product details page: click a product and see GET /api/products/:id

2) Cart
   - Add to cart from ProductCard or details
   - Update quantity in cart drawer/page
   - Remove item from cart

3) Auth
   - Register: POST /api/auth/register (new email)
   - Login: POST /api/auth/login (existing or admin@example.com / admin)
   - Me: GET /api/auth/me (after login, verify user data)

4) Checkout / Orders
   - With items in cart and authenticated, Place Order: POST /api/orders (cart clears)
   - Orders page: GET /api/orders returns new order

5) Admin (use admin@example.com / admin)
   - Navigate to /admin (requires role=admin)
   - Admin Products: GET /api/admin/products (available via /api/admin/products mirroring)
   - Admin Orders: GET /api/admin/orders
   - Admin Users: GET /api/admin/users

CORS:
- Confirm requests from http://localhost:3000 succeed (backend allows REACT_APP_FRONTEND_URL)

Notes:
- In memory storage resets on backend restart. For persistence use DATA_PERSIST=file and set DATA_DIR.
