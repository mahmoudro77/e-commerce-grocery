import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: number;
  email: string;
  name: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3000"; // json-server URL

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
      const response = await fetch(
        `${API_URL}/users?email=${email}&password=${password}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const foundUser = data[0];
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return true;
      }

      return false;
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
      // Check if email already exists
      const check = await fetch(`${API_URL}/users?email=${email}`);
      const existing = await check.json();

      if (existing.length > 0) {
        return false;
      }

      const newUser = {
        email,
        password,
        name,
        orders: [],
      };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const createdUser = await response.json();
      const { password: _, ...userWithoutPassword } = createdUser;

      setUser(userWithoutPassword);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
