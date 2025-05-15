import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Para obter o usuário e função de logout

// Estilos básicos (mova para AdminLayout.css)
// Para um layout mais complexo, CSS Modules ou TailwindCSS seriam boas escolhas.
const styles = {
  adminLayout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5', // Um cinza claro para o fundo geral
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#2c3e50', // Um azul escuro/cinza para a sidebar
    color: '#ecf0f1', // Texto claro na sidebar
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
  },
  sidebarCollapsed: { // Estilo para quando a sidebar estiver recolhida
    width: '80px',
    // Adicionar lógica para esconder texto e mostrar só ícones
  },
  sidebarHeader: {
    padding: '0 20px 20px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #34495e',
    marginBottom: '20px',
  },
  sidebarBrand: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textDecoration: 'none',
  },
  sidebarBrandShort: { // Para quando a sidebar estiver recolhida
    fontSize: '1.5rem',
  },
  navList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    flexGrow: 1,
  },
  navItem: {
    // marginBottom: '5px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 25px',
    color: '#bdc3c7', // Cor mais suave para links não ativos
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background-color 0.2s, color 0.2s',
  },
  navLinkText: {
    marginLeft: '15px',
  },
  navLinkActive: { // Estilo para NavLink ativo
    backgroundColor: '#3498db', // Cor de destaque para link ativo
    color: '#ffffff',
    fontWeight: '500',
  },
  // Ícones são placeholders, use uma lib de ícones
  navIcon: {
    width: '24px', // Para alinhar mesmo se o texto estiver escondido
    textAlign: 'center',
  },
  sidebarFooter: {
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #34495e',
    fontSize: '0.8rem',
  },
  mainContentWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    height: '70px', // Altura fixa para o topbar
  },
  toggleSidebarButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 15px',
    backgroundColor: '#e74c3c', // Vermelho para logout
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  },
  contentArea: {
    flexGrow: 1,
    padding: '0px', // O padding será nas páginas filhas
    overflowY: 'auto', // Permite scroll no conteúdo se for maior que a tela
  },
};

// Itens de navegação da sidebar
const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' }, // Substitua '📊' por um componente de ícone real
  { path: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { path: '/admin/cursos', label: 'Cursos', icon: '📚' },
  { path: '/admin/planos', label: 'Planos', icon: '💳' },
  // Adicione mais links conforme necessário (ex: Módulos, Atividades, Relatórios)
  // { path: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={styles.adminLayout}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, ...(isSidebarCollapsed ? styles.sidebarCollapsed : {}) }}>
        <div style={styles.sidebarHeader}>
          <Link to="/admin/dashboard" style={styles.sidebarBrand}>
            {isSidebarCollapsed ? <span style={styles.sidebarBrandShort}>P</span> : 'Plataforma'} {/* Nome curto ou ícone quando recolhido */}
          </Link>
        </div>
        <nav>
          <ul style={styles.navList}>
            {adminNavItems.map((item) => (
              <li key={item.path} style={styles.navItem}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {}),
                  })}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {!isSidebarCollapsed && <span style={styles.navLinkText}>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {!isSidebarCollapsed && (
            <div style={styles.sidebarFooter}>
                <p>© {new Date().getFullYear()} Admin</p>
            </div>
        )}
      </aside>

      {/* Main Content Wrapper (Topbar + Content Area) */}
      <div style={styles.mainContentWrapper}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <button onClick={toggleSidebar} style={styles.toggleSidebarButton}>
            {isSidebarCollapsed ? '☰' : '❮'} {/* Ícone de hambúrguer ou seta */}
          </button>
          <div style={styles.userInfo}>
            {user && <span style={styles.userName}>Olá, {user.nome || 'Admin'}!</span>}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sair
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main style={styles.contentArea}>
          <Outlet /> {/* Onde as páginas de admin específicas serão renderizadas */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;