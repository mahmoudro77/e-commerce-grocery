## FreshMart - Grocery Store Application

Full-stack grocery store web application built with **React + Vite (frontend)** and **Node.js (Express) + MongoDB (backend)**.

## Features

- **Storefront**: Home page with featured products and categories
- **Catalog**: Product listing with search + category filters
- **Product pages**: Detailed product page
- **Cart**: Shopping cart with quantity controls and checkout
- **Auth**: Register / Login (stored in MongoDB)
- **Orders**: Each order is stored in MongoDB and linked to the user (Order History in Profile)
- **Admin**: Admin dashboard to **create / edit / delete** products
- **UI**: Responsive design (Tailwind + shadcn/ui)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root (do **not** commit it). You can copy from `.env.example`.

Example `.env`:

```bash
VITE_API_URL=http://localhost:4000/api
MONGODB_URI=<your-mongodb-connection-string>
```

### Running the Application

You need to run both the backend API server and the frontend dev server.

1. **Start the backend (Express + MongoDB):**

```bash
npm run server
```

Backend runs on `http://localhost:4000/api`.

2. **Start the frontend (Vite) in a new terminal:**

```bash
npm run dev
```

Frontend runs on `http://localhost:8080`.

3. Open your browser at `http://localhost:8080`.

## Database / Seed (`db.json`)

- The app now uses **MongoDB** as the source of truth.
- `db.json` is only used as **optional seed data** (first run) by `backend/server.cjs` if MongoDB is empty.
- After that, all changes (products, users, orders) are persisted in MongoDB.

## Technologies Used

- **Frontend:**
  - React 18
  - Vite
  - React Router
  - Tailwind CSS
  - Context API for state management
  - Sonner for toast notifications
  - Lucide React for icons

- **Backend:**
  - Node.js + Express
  - MongoDB + Mongoose

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.tsx
│   └── ProductCard.tsx
├── contexts/         # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AdminDashboard.tsx
│   └── Profile.tsx
└── App.tsx           # Main app component

backend/
└── server.cjs        # Express API + MongoDB connection

db.json               # Optional seed data (used only when DB is empty)
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run server` - Start the backend API server (Express + MongoDB)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication

Default test accounts (seeded on first run if DB is empty):

- **Customer**
  - Email: `demo@example.com`
  - Password: `password123`
- **Admin**
  - Email: `admin@example.com`
  - Password: `admin123`

You can also register a new account. Users and orders are stored in MongoDB.

## Admin Dashboard

- Route: `/admin`
- Visible only for users with `role = "admin"`
- Allows product **create / update / delete**.

## Notes

- This is a demo project. Passwords are stored in plain text for simplicity (do not use in production).

## License

This project is open source and available under the MIT License.