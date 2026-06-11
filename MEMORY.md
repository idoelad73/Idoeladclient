# Client (Storefront) Memory

## Stack
- React 19, Vite, Tailwind CSS v4, React Router v7
- Port 5173 in dev
- API base: `import.meta.env.VITE_SERVER_URL` (default `http://localhost:3000`)

## Routing (`src/routers/index.jsx`)
All routes lazy-loaded under `RootLayout > Layout`:
| Path | Component |
|---|---|
| `/` or `/about` | About |
| `/register` | Register |
| `/login` | Login |
| `/auth/reset-password` | ResetPassword |
| `/products` | ProductsPage |
| `/products/info/:id` | ProductCard (single product) |
| `/cart` | OrderPage |
| `/order` | BeforePymentPage |
| `/profile` | UserDetailsPage |
| `/orders` | UserOrdersPage |
| `/support` | Support |
| `/checkout/contact` | Adress_phone_google (Google OAuth completion) |

## State (Zustand — `src/components/layout/`)
- `UseauthStore.js` — `{ user, isAuthenticated, login(userData), logout() }`
- `cartStore.js` — `{ cartItems[], addToCart(), updateQuantity(), removeFromCart(), clearCart() }`
- `BeforePymentStore.js` — holds order data before PayPal checkout

## Key Libraries
- `@paypal/react-paypal-js` — PaypalButton component
- `@react-oauth/google` — Google login button; after OAuth, if address/phone missing → modal `Adress_phone_google.jsx`
- `sweetalert2` — alerts/modals
- `formik` — forms
- `@tanstack/react-query` — server state (some pages)
- `lucide-react` + `react-icons` — icons

## Env Vars
```
VITE_SERVER_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=
```
