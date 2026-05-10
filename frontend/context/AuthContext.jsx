import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    const data = token ? { ...userData, token } : userData;
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update user data (e.g. after subscription change)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
