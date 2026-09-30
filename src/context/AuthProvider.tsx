import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, LoginRequest, RegisterRequest, Role } from "@/types/auth";
import { login as loginApi, register as registerApi } from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";

function readStoredUser(): AuthUser | null {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role") as Role | null;
  const applicantId = localStorage.getItem("applicantId");

  if (token && email && role) {
    return { email, role, applicantId: applicantId ? Number(applicantId) : null };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const queryClient = useQueryClient();

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
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
