"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, UserType } from "@/types";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    userType: UserType
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("auth-token");
      if (storedToken) {
        setToken(storedToken);
        await refreshUser();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth-token");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem("auth-token");
      if (!storedToken) return;

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.result);
      } else {
        // Token invalid, clear auth
        localStorage.removeItem("auth-token");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.result.user);
      setToken(data.result.token);
      localStorage.setItem("auth-token", data.result.token);

      // Redirect based on user type
      if (data.result.user.userType === "Investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    userType: UserType
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.result.user);
      setToken(data.result.token);
      localStorage.setItem("auth-token", data.result.token);

      // Redirect based on user type
      if (userType === "Investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth-token");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
