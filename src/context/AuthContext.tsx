import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, LoginRequest, RegisterRequest, Role } from "@/types/auth";
import { login as loginApi, register as registerApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";

interface AuthUser {
  email: string;
  role: Role;
  applicantId: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") as Role | null;
    const applicantId = localStorage.getItem("applicantId");

    if (token && email && role) {
      setUser({ email, role, applicantId: applicantId ? Number(applicantId) : null });
    }
    setIsLoading(false);
  }, []);

  function persistAuth(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);
    if (data.applicantId !== null) {
      localStorage.setItem("applicantId", String(data.applicantId));
    } else {
      localStorage.removeItem("applicantId");
    }
    setUser({ email: data.email, role: data.role, applicantId: data.applicantId });
  }

  async function login(data: LoginRequest) {
    const response = await loginApi(data);
    persistAuth(response);
  }

  async function register(data: RegisterRequest) {
    const response = await registerApi(data);
    persistAuth(response);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("applicantId");
    setUser(null);
    queryClient.clear();
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}