import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/axiosInstance';
import Button from '../../components/common/Button'; // Reutilizar

// Estilos básicos (mova para AdminDashboardPage.css)
const styles = {
  dashboardContainer: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50', // Um azul escuro ou cor primária do admin
    marginBottom: '5px',
  },
  welcomeSubtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#34495e', // Um azul/cinza mais escuro
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #3498db', // Cor de destaque do admin
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    borderLeft: '5px solid #3498db', // Cor de destaque
  },
  statValue: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#3498db',
    display: 'block',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#555',
    fontWeight: '500',
  },
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  quickLinkCard: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textDecoration: 'none',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
    border: '1px solid #e7e7e7'
  },
  quickLinkCardHover: { // Simulação de hover, melhor com CSS
    // transform: 'translateY(-5px)',
    // boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
  },
  quickLinkIcon: { // Você usaria ícones SVG ou FontAwesome aqui
    fontSize: '2.5rem',
    color: '#3498db',
    marginBottom: '10px',
  },
  quickLinkTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  loadingErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
  },
  // Adicionar estilos para gráficos se você os implementar
  chartContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    minHeight: '300px', // Para o gráfico ter espaço
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeSubscriptions: 0,
    // activitiesToday: 0, // Exemplo de outra métrica
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Idealmente, você teria um endpoint no backend que consolida essas estatísticas
        // GET /admin/dashboard/stats
        // Se não, você faria chamadas separadas:
        const usersPromise = apiClient.get('/usuarios?size=1'); // size=1 para pegar o total do header X-Total-Count ou da paginação
        const coursesPromise = apiClient.get('/cursos?size=1');
        const subscriptionsPromise = apiClient.get('/admin/assinaturas/ativas/contagem'); // Endpoint específico de admin para contagem

        const [usersResponse, coursesResponse, subscriptionsResponse] = await Promise.all([
          usersPromise,
          coursesPromise,
          subscriptionsPromise
        ]);
        
        // A forma de obter o total pode variar (header X-Total-Count, ou campo 'totalElements' na resposta paginada)
        // Ajuste conforme a implementação do seu backend
        const totalUsers = usersResponse.data?.totalElements || usersResponse.headers?.['x-total-count'] || 0;
        const totalCourses = coursesResponse.data?.totalElements || coursesResponse.headers?.['x-total-count'] || 0;
        const activeSubscriptions = subscriptionsResponse.data?.count || 0;


        setStats({
          totalUsers: parseInt(totalUsers, 10),
          totalCourses: parseInt(totalCourses, 10),
          activeSubscriptions: parseInt(activeSubscriptions, 10),
        });

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard de admin:", err);
        setError('Não foi possível carregar os dados do dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div style={styles.loadingErrorContainer}>Carregando dashboard do administrador...</div>;
  }

  if (error) {
    return <div style={styles.loadingErrorContainer}><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.welcomeTitle}>Painel Administrativo</h1>
        {user && <p style={styles.welcomeSubtitle}>Bem-vindo(a), {user.nome}. Gerencie a plataforma aqui.</p>}
      </header>

      {/* Seção de Estatísticas Chave */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Visão Geral da Plataforma</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.totalUsers}</span>
            <span style={styles.statLabel}>Usuários Totais</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.totalCourses}</span>
            <span style={styles.statLabel}>Cursos Publicados</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{stats.activeSubscriptions}</span>
            <span style={styles.statLabel}>Assinaturas Ativas</span>
          </div>
          {/* Adicionar mais cards de estatísticas conforme necessário */}
        </div>
      </section>

      {/* Seção de Links Rápidos de Gerenciamento */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Gerenciamento Rápido</h2>
        <div style={styles.quickLinksGrid}>
          <Link to="/admin/usuarios" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>👥</div> {/* Substitua por ícone real */}
            <span style={styles.quickLinkTitle}>Gerenciar Usuários</span>
          </Link>
          <Link to="/admin/cursos" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>📚</div> {/* Substitua por ícone real */}
            <span style={styles.quickLinkTitle}>Gerenciar Cursos</span>
          </Link>
          <Link to="/admin/planos" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>💳</div> {/* Substitua por ícone real */}
            <span style={styles.quickLinkTitle}>Gerenciar Planos</span>
          </Link>
          {/* <Link to="/admin/modulos" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>🧩</div>
            <span style={styles.quickLinkTitle}>Gerenciar Módulos</span>
          </Link>
          <Link to="/admin/atividades" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>📝</div>
            <span style={styles.quickLinkTitle}>Gerenciar Atividades</span>
          </Link> */}
          {/* <Link to="/admin/relatorios" style={styles.quickLinkCard}>
            <div style={styles.quickLinkIcon}>📊</div>
            <span style={styles.quickLinkTitle}>Ver Relatórios</span>
          </Link> */}
        </div>
      </section>

      {/* Seção de Gráficos (Opcional) */}
      {/* 
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Atividade Recente</h2>
        <div style={styles.chartContainer}>
          {/* Aqui você usaria uma biblioteca de gráficos como Chart.js, Recharts, etc. */}
      {/*    <p style={{color: '#999'}}>Gráfico de novos usuários (Exemplo)</p>
        </div>
      </section>
      */}
    </div>
  );
};

export default AdminDashboardPage;