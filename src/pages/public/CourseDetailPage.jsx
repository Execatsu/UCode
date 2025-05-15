import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth'; // Para verificar se o usuário está logado e se é admin
import Button from '../../components/common/Button';

// Estilos básicos (você pode mover para um arquivo CSS: CourseDetailPage.css)
const styles = {
  pageContainer: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  loadingErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  courseImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  metaInfo: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#555',
    marginBottom: '30px',
    whiteSpace: 'pre-wrap', // Para respeitar quebras de linha da descrição
  },
  actionButtonContainer: {
    marginBottom: '40px',
    textAlign: 'left', // ou 'center'
  },
  modulesSection: {
    marginTop: '30px',
  },
  modulesTitle: {
    fontSize: '2rem',
    color: '#34495e',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #4a90e2',
  },
  moduleItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '25px',
    padding: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  moduleTitle: {
    fontSize: '1.5rem',
    color: '#2980b9',
    marginBottom: '15px',
  },
  activitiesList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  activityItem: {
    padding: '10px 0',
    borderBottom: '1px dashed #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
  },
  activityLink: {
    textDecoration: 'none',
    color: '#3498db',
    fontWeight: '500',
    transition: 'color 0.2s',
    '&:hover': { // Este estilo :hover não funcionará diretamente em JS inline, seria melhor com CSS
      color: '#2575a7',
    }
  },
  noModules: {
    padding: '20px',
    textAlign: 'center',
    color: '#777',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  }
};

const CourseDetailPage = () => {
  const { id_curso } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para simular se o usuário tem acesso ao curso
  // Em um cenário real, isso viria do backend (ex: se o usuário assinou um plano que inclui este curso)
  const [userHasAccess, setUserHasAccess] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Buscar detalhes do curso
        const courseResponse = await apiClient.get(`/cursos/${id_curso}`);
        setCourse(courseResponse.data);

        // 2. Buscar módulos do curso
        // Opcional: você pode querer buscar atividades junto com os módulos
        // ou fazer chamadas separadas para atividades de cada módulo se a lista for grande.
        // Aqui, vamos buscar módulos e depois, para cada módulo, suas atividades.
        const modulesResponse = await apiClient.get(`/cursos/${id_curso}/modulos`);
        const modulesData = modulesResponse.data;

        // 3. Para cada módulo, buscar suas atividades (exemplo)
        //    Pode ser otimizado se o backend puder retornar módulos com atividades aninhadas.
        const modulesWithActivities = await Promise.all(
          modulesData.map(async (module) => {
            try {
              const activitiesResponse = await apiClient.get(`/modulos/${module.id_modulo}/atividades`);
              return { ...module, atividades: activitiesResponse.data };
            } catch (activityError) {
              console.warn(`Erro ao buscar atividades para o módulo ${module.id_modulo}:`, activityError);
              return { ...module, atividades: [] }; // Retorna módulo mesmo se atividades falharem
            }
          })
        );
        setModules(modulesWithActivities);

        // Lógica de exemplo para verificar acesso (simplificada)
        // Em um sistema real, isso viria do backend:
        // ex: /usuarios/me/cursos/{id_curso}/acesso
        if (isAuthenticated) {
            // Simulação: se o usuário for admin, tem acesso.
            // Ou se o curso for gratuito (não implementado aqui)
            // Ou se o usuário tiver uma assinatura ativa que cubra o curso.
            if (user?.is_admin) {
                setUserHasAccess(true);
            } else {
                // TODO: Implementar lógica real de verificação de acesso.
                // Por enquanto, vamos assumir que se está logado, tem acesso para fins de demonstração.
                // setUserHasAccess(true);
                // Ou verificar se o curso tem um plano e se o usuário tem esse plano ativo.
                // Ex: const userSubscriptions = await apiClient.get(`/usuarios/${user.id_usuario}/assinaturas/ativa`);
                // e então verificar se alguma assinatura cobre este curso.
            }
        }


      } catch (err) {
        console.error("Erro ao buscar dados do curso:", err);
        if (err.response && err.response.status === 404) {
          setError(`Curso não encontrado.`);
        } else {
          setError('Não foi possível carregar os detalhes do curso. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id_curso, isAuthenticated, user]); // Adicionar user aqui se a lógica de acesso depender dele

  const handleStartActivity = (id_atividade) => {
    if (userHasAccess || (user && user.is_admin)) { // Verifica se tem acesso ou é admin
      navigate(`/atividade/${id_atividade}`);
    } else if (isAuthenticated) {
        // Se está autenticado mas não tem acesso (e não é admin), poderia redirecionar para planos
        alert("Você precisa adquirir um plano ou este curso para acessar as atividades.");
        navigate('/planos'); // Ou uma página específica de compra do curso
    }
    else {
      // Se não está autenticado, redireciona para login
      alert("Você precisa estar logado para iniciar as atividades.");
      navigate('/login', { state: { from: `/cursos/${id_curso}` } });
    }
  };

  if (loading) {
    return <div style={styles.loadingErrorContainer}>Carregando detalhes do curso...</div>;
  }

  if (error) {
    return <div style={styles.loadingErrorContainer}><p style={{color: 'red'}}>{error}</p></div>;
  }

  if (!course) {
    return <div style={styles.loadingErrorContainer}>Curso não encontrado.</div>;
  }

  const renderActionButtons = () => {
    if (user && user.is_admin) {
      return (
        <Link to={`/admin/cursos/${id_curso}/gerenciar`}> {/* Rota de gerenciamento do curso no admin */}
          <Button variant="primary">Gerenciar Curso</Button>
        </Link>
      );
    }

    if (userHasAccess) {
      // Encontra a primeira atividade do primeiro módulo para o botão "Iniciar/Continuar"
      const firstActivityId = modules[0]?.atividades[0]?.id_atividade;
      return (
        <Button variant="primary" onClick={() => firstActivityId ? handleStartActivity(firstActivityId) : alert("Este curso ainda não possui atividades.")}>
          {/* TODO: Melhorar a lógica de "Iniciar" vs "Continuar" baseado no progresso do usuário */}
          Iniciar Curso
        </Button>
      );
    }

    // Se não tem acesso e não é admin
    return (
      <Link to="/planos"> {/* Ou para uma página de compra específica do curso */}
        <Button variant="secondary">Ver Planos de Assinatura</Button>
      </Link>
    );
  };


  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        {course.imagem_capa && (
          <img src={course.imagem_capa} alt={`Capa do curso ${course.nome}`} style={styles.courseImage} />
        )}
        <h1 style={styles.title}>{course.nome}</h1>
        <div style={styles.metaInfo}>
          <span>Nível: {course.nivel_dificuldade || 'Não especificado'}</span>
          {/* Adicionar mais meta-informações se houver (ex: instrutor, duração estimada) */}
          <span>Módulos: {modules.length}</span>
        </div>
        <div style={styles.actionButtonContainer}>
            {renderActionButtons()}
        </div>
        {course.descricao && <p style={styles.description}>{course.descricao}</p>}
      </header>

      <section style={styles.modulesSection}>
        <h2 style={styles.modulesTitle}>Conteúdo do Curso</h2>
        {modules.length > 0 ? (
          modules.map((module) => (
            <div key={module.id_modulo} style={styles.moduleItem}>
              <h3 style={styles.moduleTitle}>{module.nome}</h3>
              {module.atividades && module.atividades.length > 0 ? (
                <ul style={styles.activitiesList}>
                  {module.atividades.map((activity, index) => (
                    <li key={activity.id_atividade} style={styles.activityItem}>
                      <span>{index + 1}. {activity.nome || `Atividade ${activity.id_atividade}`} {/* Assumindo que atividade tem um 'nome' */}</span>
                      {/* O link para atividade deve ser dinâmico e verificar acesso */}
                      <Button
                        variant="link"
                        onClick={() => handleStartActivity(activity.id_atividade)}
                        // style={styles.activityLink} // Estilo de link pode ser adicionado ao Button component
                      >
                        Acessar
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Este módulo ainda não possui atividades.</p>
              )}
            </div>
          ))
        ) : (
          <div style={styles.noModules}>
            <p>O conteúdo deste curso ainda não foi adicionado.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseDetailPage;