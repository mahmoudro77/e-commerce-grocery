import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Edit3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
  featured: boolean;
}

const emptyProduct: Product = {
  name: "",
  category: "",
  price: 0,
  unit: "",
  image: "",
  description: "",
  inStock: true,
  featured: false,
};

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(emptyProduct);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyProduct);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.id) {
        const res = await fetch(`${API_URL}/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editing, ...form }),
        });
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success("Product updated");
      } else {
        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setProducts((prev) => [...prev, created]);
        toast.success("Product created");
      }
      resetForm();
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
      featured: product.featured,
    });
  };

  const handleDelete = async (product: Product) => {
    if (!product.id) return;
    if (!confirm(`Delete "${product.name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Product deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage products: create, update, and delete.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,1.2fr] gap-8 items-start">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                Products ({products.length})
              </h2>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading products...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Price</th>
                      <th className="py-2 pr-4">Stock</th>
                      <th className="py-2 pr-4">Featured</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-2 pr-4 font-medium text-card-foreground">
                          {product.name}
                        </td>
                        <td className="py-2 pr-4">{product.category}</td>
                        <td className="py-2 pr-4">${product.price.toFixed(2)}</td>
                        <td className="py-2 pr-4">
                          {product.inStock ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                              In stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700">
                              Out
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {product.featured ? "Yes" : "No"}
                        </td>
                        <td className="py-2 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 text-foreground"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">
                    Category
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Fruits, Vegetables..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">
                    Unit
                  </label>
                  <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="lb, each, box..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                  placeholder="Short product description"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-card-foreground">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={form.inStock}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  In stock
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-card-foreground">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  Featured
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                {editing ? "Save changes" : "Create product"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

