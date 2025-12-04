import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_BASE = "http://localhost:3000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/current_user`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        const u = data?.user || data;
        if (u && u.id) setUser(u);
        return u;
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    const u = data.user || data;
    setUser(u);
    return u;
  };

  const signup = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      user: { name, email, password },  
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.errors?.[0] || "Could not create account");
  }

  setUser(data); 
  return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
