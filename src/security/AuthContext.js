import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDecodedToken, isAuthenticated, login, logout } from './auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  
  //user.sub (email)
  //user.exp (expiration)
  //user.iat (issued at) 
  //user.role (role) 
  //user.id (id)

  useEffect(() => {
    const token = getDecodedToken();
    if (token) {
      setUser(token);
    }
  }, []);

  const handleLogin = (token) => {
    login(token);
    const decoded = getDecodedToken();
    setUser(decoded);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
