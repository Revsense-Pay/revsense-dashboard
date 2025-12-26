'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  const login = (email) => {
    setUser({ email });
  };

  const logout = () => {
    setUser(null);
    setWorkspace(null);
  };

  const createWorkspace = (data) => {
    setWorkspace(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        isAuthenticated: !!user,
        hasWorkspace: !!workspace,
        login,
        logout,
        createWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);