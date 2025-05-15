import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/cursos">Cursos</Link> |
        <Link to="/meu-progresso">Meu Progresso</Link> |
        <Link to="/meu-perfil">Perfil</Link>
        {user && (
          <span>
            | Olá, {user.nome}! <button onClick={logout}>Sair</button>
          </span>
        )}
      </nav>
      <hr />
      <main>
        <Outlet /> {/* Conteúdo da rota específica será renderizado aqui */}
      </main>
      <footer>
        <p>© 2025 UCode</p>
      </footer>
    </div>
  );
}
export default UserLayout;