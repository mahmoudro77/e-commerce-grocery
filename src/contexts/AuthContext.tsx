import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_URL } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  name: string;
  role?: "user" | "admin";
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  userId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  addOrder: (order: Order) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ============================
  // ✔ LOGIN using json-server
  // ============================
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return false;
      const safeUser = await response.json();
      setUser(safeUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ============================
  // ✔ REGISTER using json-server
  // ============================
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) return false;

      const createdUser = await response.json();
      setUser(createdUser);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // ============================
  // ✔ LOGOUT
  // ============================
  const logout = () => {
    setUser(null);
  };

  // ============================
  // ✔ ADD ORDER to current user
  // ============================
  const addOrder = async (order: Order): Promise<void> => {
    if (!user) return;

    const orderWithUser: Order = { ...order, userId: user.id };
    const optimisticOrders = [...(user.orders ?? []), orderWithUser];

    // Optimistic update for UI & localStorage
    setUser({ ...user, orders: optimisticOrders });

    try {
      // 1) Persist order in top-level /orders collection
      const createRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderWithUser),
      });

      if (!createRes.ok) {
        console.error("Failed to create order in /orders");
      }

      const created =
        createRes.ok ? ((await createRes.json()) as Order) : orderWithUser;

      const updatedOrders = [...(user.orders ?? []), created];

      // 2) Patch user with full orders array so it's linked to the user
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: updatedOrders }),
      });

      if (!response.ok) {
        console.error("Failed to persist order on server");
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
