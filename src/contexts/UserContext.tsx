import React, { createContext, useState, useEffect, ReactNode } from 'react';
import UserService from '../services/services_user';
import { UserAsPassenger } from '../models/UserAsPassenger';
import AuthService from '../services/services_login';

type UserContextType = {
    currentUser: UserAsPassenger | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
    currentUser: null,
    loading: true,
    refreshUser: async () => { },
    logout: async () => { },
});

type Props = {
    children: ReactNode;
};

export function UserProvider({ children }: Props) {
    const [currentUser, setCurrentUser] = useState<UserAsPassenger | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        setLoading(true);
        try {
            const user = await UserService.getCurrentUser();
            setCurrentUser(user);
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const logout = async () => {
        try {
            await AuthService.signOut('Login');
        } finally {
            setCurrentUser(null);             // zera o usuário
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, loading, refreshUser: loadUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}
