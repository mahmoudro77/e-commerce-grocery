const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ----- Mongoose models -----
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  unit: String,
  image: String,
  description: String,
  inStock: Boolean,
  featured: Boolean,
});

const orderItemSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    quantity: Number,
    price: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  items: [orderItemSchema],
  total: Number,
  status: String,
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // NOTE: plain text for demo only
  name: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  orders: [orderSchema],
});

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const User = mongoose.model("User", userSchema);

// ----- Seed from db.json (once) -----
async function seedFromJsonIfEmpty() {
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  if (productsCount > 0 || usersCount > 0) {
    return;
  }

  const dbPath = path.join(__dirname, "..", "db.json");
  if (!fs.existsSync(dbPath)) {
    console.warn("db.json not found, skipping seed.");
    return;
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  const parsed = JSON.parse(raw);

  const products = parsed.products || [];
  const users = parsed.users || [];
  const orders = parsed.orders || [];

  const createdProducts = await Product.insertMany(products);

  // Map legacy numeric id -> Mongo ObjectId for users
  const createdUsers = [];
  for (const u of users) {
    const userDoc = new User({
      email: u.email,
      password: u.password,
      name: u.name,
      role: u.role || "user",
      orders: [],
    });
    await userDoc.save();
    createdUsers.push({ legacyId: u.id, doc: userDoc });
  }

  // Seed orders collection and attach to users if any
  for (const o of orders) {
    const owner = createdUsers.find((u) => u.legacyId === o.userId);
    if (!owner) continue;
    const orderDoc = new Order({
      userId: owner.doc._id,
      date: o.date,
      items: o.items,
      total: o.total,
      status: o.status,
    });
    await orderDoc.save();
    owner.doc.orders.push(orderDoc);
    await owner.doc.save();
  }

  console.log("Seeded MongoDB from db.json");
}

// ----- Routes -----

// Auth
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password }).lean();
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = new User({
      email,
      password,
      name,
      role: "user",
      orders: [],
    });
    await user.save();
    const obj = user.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Products
app.get("/api/products", async (req, res) => {
  try {
    const filter = {};
    if (req.query.featured === "true") {
      filter.featured = true;
    }
    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (err) {
    console.error("Get products error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Get product error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Update product error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("Delete product error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Orders
app.post("/api/orders", async (req, res) => {
  const { userId, date, items, total, status } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = new Order({
      userId: user._id,
      date,
      items,
      total,
      status,
    });
    await order.save();

    user.orders.push(order);
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/orders/me/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).lean();
    res.json(orders);
  } catch (err) {
    console.error("Get orders error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----- Start server -----
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedFromJsonIfEmpty();
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

