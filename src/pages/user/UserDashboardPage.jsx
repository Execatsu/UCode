import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/axiosInstance';
import CourseCard from '../../components/specific/CourseCard'; // Reutilizar
import Button from '../../components/common/Button'; // Reutilizar

// Estilos básicos (mova para UserDashboardPage.css)
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
    color: '#2c3e50',
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
    color: '#34495e',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #4a90e2',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  },
  statusCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  statusValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4a90e2',
    margin: '5px 0',
  },
  statusLabel: {
    fontSize: '0.9rem',
    color: '#555',
  },
  quickLinks: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  emptyState: {
    padding: '30px',
    textAlign: 'center',
    color: '#777',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  loadingErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
  },
};

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Só executa se o usuário estiver definido

      setLoading(true);
      setError('');
      try {
        // 1. Buscar status do usuário (vidas, nível, xp, moedas)
        // Este endpoint já retorna o status dentro do objeto do usuário em /usuarios/me
        // Mas se você tiver um endpoint separado para USUARIO_STATUS:
        // const statusResponse = await apiClient.get(`/usuarios/${user.id_usuario}/status`);
        // setUserStatus(statusResponse.data);
        // Se o status já vem com o `user` do AuthContext, use-o.
        // Vamos assumir que o endpoint /usuarios/me pode ter o status embutido
        // ou que você pode precisar buscar explicitamente.
        // Se o user do AuthContext já tem o status, pode pular esta chamada.
        // Por agora, vamos buscar de /usuarios/me para ter os dados mais recentes.
        const userDetailsResponse = await apiClient.get(`/usuarios/me`);
        // Assumindo que o status está em userDetailsResponse.data.usuarioStatus
        setUserStatus(userDetailsResponse.data.usuarioStatus || { vidas: 0, nivel: 0, xp: 0, moedas: 0 });


        // 2. Buscar cursos em andamento
        //   Isto é mais complexo e depende de como você define "em andamento".
        //   Poderia ser um endpoint dedicado: /usuarios/me/cursos/em-andamento
        //   Ou você busca todos os cursos que o usuário tem acesso e depois filtra
        //   aqueles que têm algum progresso mas não estão 100% concluídos.
        //   Para este exemplo, vamos simular com uma chamada genérica e depois filtrar.
        //   (Em um sistema real, o backend faria esse filtro)
        const progressResponse = await apiClient.get(`/usuarios/${user.id_usuario}/progresso`);
        const allUserProgress = progressResponse.data; // Array de PROGRESSO_USUARIO

        // Se temos progresso, precisamos dos detalhes dos cursos associados a esse progresso
        // E filtrar os que não estão 100% concluídos.
        // Esta lógica é um pouco complexa para o frontend e idealmente seria feita no backend.
        // Simplificação: vamos buscar alguns cursos que o usuário assina e mostrar.
        // Em um sistema ideal, o backend retornaria os cursos em andamento diretamente.
        // Por ora, vamos buscar os cursos que o usuário tem assinatura ativa
        // e depois você implementaria a lógica de progresso.
        let coursesSubscribed = [];
        try {
            const subscriptionsResponse = await apiClient.get(`/usuarios/${user.id_usuario}/assinaturas/ativa`);
            if (subscriptionsResponse.data) { // Pode ser um único objeto ou um array
                const activeSubscriptions = Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : [subscriptionsResponse.data];
                
                const coursePromises = activeSubscriptions.map(async (sub) => {
                    // Precisamos de um endpoint que liste cursos de um plano
                    // Ou assumir que o benefício do plano descreve os cursos.
                    // Por simplicidade, vamos buscar alguns cursos quaisquer e fingir que são os "em andamento".
                    // Em um cenário real: /planos/{id_plano}/cursos ou algo similar
                    return null; // Placeholder
                });
                // coursesSubscribed = (await Promise.all(coursePromises)).filter(Boolean);
            }
        } catch (subError) {
            console.warn("Nenhuma assinatura ativa ou erro ao buscar:", subError);
        }

        // SIMULAÇÃO: vamos pegar os primeiros 3 cursos gerais e fingir que são "em andamento"
        // SUBSTITUA PELA LÓGICA REAL
        const generalCoursesResponse = await apiClient.get('/cursos?page=0&size=3');
        setInProgressCourses(generalCoursesResponse.data.content || generalCoursesResponse.data);


        // 3. Buscar cursos recomendados (ex: os mais novos ou populares)
        //    (similar à HomePage, mas pode ter lógica diferente)
        const recommendedResponse = await apiClient.get('/cursos?page=0&size=3&sortBy=data_criacao&order=desc'); // Ex: mais recentes
        setRecommendedCourses(recommendedResponse.data.content || recommendedResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError('Não foi possível carregar os dados do dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Depende do usuário estar carregado

  if (loading) {
    return <div style={styles.loadingErrorContainer}>Carregando seu dashboard...</div>;
  }

  if (error) {
    return <div style={styles.loadingErrorContainer}><p style={{color: 'red'}}>{error}</p></div>;
  }

  // Se user não estiver carregado (improvável se esta rota for protegida corretamente)
  if (!user) {
    return <div style={styles.loadingErrorContainer}>Usuário não encontrado.</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.welcomeTitle}>Bem-vindo(a) de volta, {user.nome}!</h1>
        <p style={styles.welcomeSubtitle}>Continue sua jornada de aprendizado ou explore novas trilhas.</p>
      </header>

      {/* Seção de Status do Usuário */}
      {userStatus && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Seu Status</h2>
          <div style={{...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={styles.statusCard}>
              <span style={styles.statusValue}>{userStatus.nivel}</span>
              <span style={styles.statusLabel}>Nível</span>
            </div>
            <div style={styles.statusCard}>
              <span style={styles.statusValue}>{userStatus.xp}</span>
              <span style={styles.statusLabel}>XP</span>
            </div>
            <div style={styles.statusCard}>
              <span style={styles.statusValue}>{userStatus.moedas}</span>
              <span style={styles.statusLabel}>Moedas</span>
            </div>
            <div style={styles.statusCard}>
              <span style={styles.statusValue}>{userStatus.vidas}</span>
              <span style={styles.statusLabel}>Vidas</span>
            </div>
          </div>
        </section>
      )}

      {/* Seção de Cursos em Andamento */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Continue Aprendendo</h2>
        {inProgressCourses.length > 0 ? (
          <div style={styles.grid}>
            {inProgressCourses.map(course => (
              <CourseCard key={course.id_curso} course={course} showProgress={true} /> // showProgress é uma prop opcional para CourseCard
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>Você ainda não iniciou nenhum curso. Que tal começar um agora?</p>
            <Link to="/cursos">
              <Button variant="primary" style={{ marginTop: '15px' }}>Explorar Cursos</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Seção de Cursos Recomendados */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Cursos Recomendados para Você</h2>
        {recommendedCourses.length > 0 ? (
          <div style={styles.grid}>
            {recommendedCourses.map(course => (
              <CourseCard key={course.id_curso} course={course} />
            ))}
          </div>
        ) : (
          <p>Nenhuma recomendação no momento. Explore todos os nossos <Link to="/cursos">cursos</Link>!</p>
        )}
      </section>

      {/* Seção de Links Rápidos (Opcional, pode estar no Navbar do UserLayout) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Acesso Rápido</h2>
        <div style={styles.quickLinks}>
          <Link to="/meus-cursos"> {/* Você precisará criar esta página */}
            <Button variant="secondary">Meus Cursos</Button>
          </Link>
          <Link to="/meu-progresso"> {/* Você precisará criar esta página */}
            <Button variant="secondary">Meu Progresso Detalhado</Button>
          </Link>
          <Link to="/meu-perfil"> {/* Você precisará criar esta página */}
            <Button variant="secondary">Editar Perfil</Button>
          </Link>
          <Link to="/minhas-assinaturas"> {/* Você precisará criar esta página */}
            <Button variant="secondary">Minhas Assinaturas</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardPage;