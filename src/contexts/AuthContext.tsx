// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AuthService from "../services/services_login";
import UserService from "../services/services_user";
import { UserAsPassenger } from "../models/UserAsPassenger";

type AuthCtx = {
    currentUser: UserAsPassenger | null;
    loading: boolean;
    /** login (recebe email e senha, faz sign‑in, carrega perfil) */
    signIn: (email: string, password: string) => Promise<void>;
    /** logout global */
    signOut: () => Promise<void>;
    /** força recarregar o perfil */
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserAsPassenger | null>(null);
    const [loading, setLoading] = useState(true);

    /* ---- helpers ---- */
    const refreshUser = async () => {
        try {
            const profile = await UserService.getCurrentUser();
            setCurrentUser(profile);
        } catch {
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        // faz login no Supabase e já devolve o perfil
        const response = await AuthService.SignInWithEmail({ email, pin: password });

        if (!response) throw new Error('Login failed');

        setCurrentUser(response.profile);   // 🔑 atualiza o contexto imediatamente
        setLoading(false);         // certifica que não fica preso no loader
    };

    const signOut = async () => {
        await AuthService.signOut("Login"); // já faz reset da navegação
        setCurrentUser(null);
    };

    /* carrega perfil ao montar */
    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading, signIn, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
