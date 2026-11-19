import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } });
  useEffect(() => {
    const sync = () => { try { setUser(JSON.parse(localStorage.getItem("user") || "null")); } catch { setUser(null); } };
    window.addEventListener("storage", sync);
    window.addEventListener("accesspass-auth-change", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("accesspass-auth-change", sync); };
  }, []);
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(localStorage.getItem("token") && user) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
