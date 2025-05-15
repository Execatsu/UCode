import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// isAdmin prop para rotas de admin
const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Carregando autenticação...</div>; // Ou um spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se é uma rota de admin e o usuário não é admin
  if (isAdminRoute && (!user || !user.is_admin)) {
    return <Navigate to="/dashboard" replace />; // Ou para uma página "Não autorizado"
  }

  return <Outlet />; // Renderiza o componente filho (a rota protegida)
};

export default ProtectedRoute;