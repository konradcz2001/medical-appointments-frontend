import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDecodedToken, login, logout } from './auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null); 
  
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      setToken(storedToken);
      const decoded = getDecodedToken(storedToken);
      setUser(decoded);
    }
  }, []);

  const handleLogin = (token) => {
    login(token); 
    setToken(token);
    const decoded = getDecodedToken(token);
    setUser(decoded);
  };

  const handleLogout = () => {
    logout(); 
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
