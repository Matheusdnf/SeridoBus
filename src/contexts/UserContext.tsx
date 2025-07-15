import React, { createContext, useState, useEffect, ReactNode } from 'react';
import UserService from '../services/services_user';
import { UserAsPassenger } from '../models/UserAsPassenger';

type UserContextType = {
  currentUser: UserAsPassenger | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  loading: true,
  refreshUser: async () => {},
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

  return (
    <UserContext.Provider value={{ currentUser, loading, refreshUser: loadUser }}>
      {children}
    </UserContext.Provider>
  );
}
