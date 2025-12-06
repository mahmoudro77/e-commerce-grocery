# FreshMart - Grocery Store Application

A full-stack grocery store web application built with React, Vite, and json-server.

## Features

- 🏠 Homepage with featured products and categories
- 🛍️ Product listing with search and category filters
- 📝 Detailed product pages
- 🛒 Shopping cart with quantity controls
- 👤 User authentication (Register/Login)
- 📦 User profile with order history
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
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

### Running the Application

You need to run both the frontend and the backend API server:

1. **Start the json-server (Backend API):**
```bash
npm run server
```
This will start the API server on `http://localhost:3000`

2. **Start the React app (Frontend) in a new terminal:**
```bash
npm run dev
```
This will start the development server on `http://localhost:8080`

3. Open your browser and visit `http://localhost:8080`

## Mock Data

The application uses json-server with mock data in `db.json`. The database includes:
- 12 sample products across different categories
- Mock user authentication
- Order history

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
  - json-server (Mock REST API)

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
│   └── Profile.tsx
└── App.tsx           # Main app component

db.json              # Mock database for json-server
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run server` - Start the json-server API
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication

The app uses mock authentication with localStorage. Default test account:
- Email: demo@example.com
- Password: password123

You can also register a new account which will be stored in localStorage.

## License

This project is open source and available under the MIT License.