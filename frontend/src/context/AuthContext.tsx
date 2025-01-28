"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase'; // Firebase initialization
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, User, UserCredential, createUserWithEmailAndPassword } from 'firebase/auth';

import type { ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    login: async (email: string, password: string) => { throw new Error("Not implemented"); }, 
    loginWithGoogle: async () => { throw new Error("Not implemented"); }, 
    logout: async () => {},
    signup: async (email: string, password: string) => { throw new Error("Not implemented"); }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};