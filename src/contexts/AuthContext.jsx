import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, logoutUser as apiLogout, getAuthenticatedUser } from '../api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para verificar o estado inicial de auth

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Poderia validar o token aqui ou buscar dados do usuário
        // Exemplo: const userData = await getAuthenticatedUser();
        // setUser(userData);
        // Por simplicidade, vamos apenas pegar do localStorage por enquanto se existir
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        } else {
            // Se não tiver userData mas tiver token, pode ser um estado inválido ou precisar buscar
            // Aqui, vamos tentar buscar do backend
            try {
                const freshUserData = await getAuthenticatedUser();
                setUser(freshUserData);
                localStorage.setItem('userData', JSON.stringify(freshUserData));
            } catch (fetchError) {
                console.error("Falha ao buscar dados do usuário com token existente:", fetchError);
                apiLogout(); // Limpa token inválido
                setUser(null);
            }
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        apiLogout(); // Limpa token inválido
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      setUser(data.user); // Supondo que o backend retorne { token: '...', user: {...} }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await apiRegister(userData);
      // Opcional: logar o usuário automaticamente após o registro
      // Se o backend retornar token e user no registro:
      // setUser(data.user);
      // localStorage.setItem('authToken', data.token);
      // localStorage.setItem('userData', JSON.stringify(data.user));
      setLoading(false);
      return data; // ou data.message
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, isAuthenticated: !!user }}>
      {!loading && children} {/* Só renderiza children quando o loading inicial terminar */}
    </AuthContext.Provider>
  );
};