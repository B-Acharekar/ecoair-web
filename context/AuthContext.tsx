"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  uid: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true,
  uid: null,
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUid(user.uid);
    } else {
      setUid(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, uid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
