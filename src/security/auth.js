import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decoded.exp && decoded.exp > currentTime) {
      return decoded;
    }
    localStorage.removeItem('jwt'); // Remove expired token
    return null;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getDecodedToken();
};

export const login = (token) => {
  localStorage.setItem('jwt', token);
};

export const logout = () => {
  localStorage.removeItem('jwt');
};
