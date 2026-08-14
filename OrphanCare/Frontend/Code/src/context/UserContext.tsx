// src/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type UserType = "donor" | "orphanage" | null;

type UserContextValue = {
  userType: UserType;
  userName?: string | null;
  setUserType: (t: UserType) => void;
  setUserName: (n?: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    // seed from localStorage if available
    try {
      const storedType = localStorage.getItem("userType");
      if (storedType === "donor" || storedType === "orphanage") setUserTypeState(storedType);
      const storedName = localStorage.getItem("userName");
      if (storedName) setUserNameState(storedName);
    } catch (err) {
      // ignore
    }
  }, []);

  const setUserType = (t: UserType) => {
    try {
      if (t) localStorage.setItem("userType", t);
      else localStorage.removeItem("userType");
    } catch (err) {
      console.warn("UserContext: failed writing userType", err);
    }
    setUserTypeState(t);
  };

  const setUserName = (n?: string | null) => {
    try {
      if (n) localStorage.setItem("userName", n);
      else localStorage.removeItem("userName");
    } catch (err) {
      // ignore
    }
    setUserNameState(n ?? null);
  };

  const logout = () => {
    try {
      localStorage.removeItem("userType");
      localStorage.removeItem("userName");
      // clear other auth tokens if stored
    } catch (err) {
      console.warn("UserContext: error clearing storage", err);
    }
    setUserTypeState(null);
    setUserNameState(null);
  };

  return (
    <UserContext.Provider value={{ userType, userName, setUserType, setUserName, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
