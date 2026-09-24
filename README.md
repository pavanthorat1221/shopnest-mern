# ShopNest — MERN E-Commerce Platform

ShopNest is a full-stack e-commerce portfolio project extended with practical customer and admin workflows: product discovery, wishlists, reviews, inventory-safe ordering, and order fulfillment updates.

## Highlights

- JWT authentication with protected customer and admin routes
- Searchable product catalog with category filters and price/rating sorting
- Persistent cart and wishlist state powered by Redux Toolkit
- Authenticated product reviews with one review per customer and recalculated ratings
- Server-side inventory validation and stock reduction at checkout
- Admin dashboard for catalog, customer, and order management
- Order-status updates with optional customer email notifications
- Razorpay test-payment integration, Cloudinary uploads, and MongoDB Atlas support

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, React Router, Redux Toolkit, Context API |
| Backend | Node.js, Express, JWT, Mongoose |
| Database | MongoDB / MongoDB Atlas |
| Integrations | Razorpay, Cloudinary, Nodemailer |

## Run Locally

### Prerequisites

- Node.js 18 or later
- A MongoDB Atlas connection string or a local MongoDB server

### 1. Install dependencies

```bash
npm run install-all
```

### 2. Configure environment variables

Copy the safe template and add your own values:

```bash
copy backend\\.env.example backend\\.env
```

Update `MONGO_URI` and `JWT_SECRET` in `backend/.env`. For Atlas, add your public IP address to the Atlas project IP access list.

### 3. Seed local demo data

```bash
npm run seed
```

### 4. Start the app

```bash
npm run dev
```

- Storefront: `http://localhost:3000`
- API: `http://localhost:5000`

### Demo admin account

```text
Email: admin@shopnest.local
Password: ShopNest@123
```

Use this account only for local demonstration data.

## API Testing

Import `ShopEase_Postman_Collection.json` into Postman to explore the API.

## Project structure

```text
frontend/    React storefront and admin interface
backend/     Express API, database models, and business logic
```
