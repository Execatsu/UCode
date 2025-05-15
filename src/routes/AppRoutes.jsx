import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import CourseListPage from '../pages/public/CourseListPage';
import CourseDetailPage from '../pages/public/CourseDetailPage'; // Você vai criar esta

import UserDashboardPage from '../pages/user/UserDashboardPage'; // Você vai criar esta
import ActivityPage from '../pages/user/ActivityPage'; // Você vai criar esta

import AdminDashboardPage from '../pages/admin/AdminDashboardPage'; // Você vai criar esta
import AdminCourseManagementPage from '../pages/admin/AdminCourseManagementPage'; // Você vai criar esta

import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../components/layout/UserLayout'; // Layout com Navbar, etc. para usuários
import AdminLayout from '../components/layout/AdminLayout'; // Layout para admin

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cursos" element={<CourseListPage />} />
      <Route path="/cursos/:id_curso" element={<CourseDetailPage />} />

      {/* Rotas Protegidas para Usuários Logados */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}> {/* Layout para usuário logado */}
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/atividade/:id_atividade" element={<ActivityPage />} />
          {/* Adicione outras rotas de usuário aqui: perfil, progresso, etc. */}
        </Route>
      </Route>

      {/* Rotas Protegidas para Administradores */}
      <Route element={<ProtectedRoute isAdminRoute={true} />}>
        <Route element={<AdminLayout />}> {/* Layout para admin */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/cursos" element={<AdminCourseManagementPage />} />
          {/* Adicione outras rotas de admin aqui */}
        </Route>
      </Route>

      {/* Rota para Not Found ou redirecionamento */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;