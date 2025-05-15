import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosInstance';
import Button from '../../components/common/Button';
// Modal e Formulário de Curso (a serem criados)
import CourseFormModal from '../../components/admin/CourseFormModal'; // Assumindo que você criará este

// Estilos básicos (mova para AdminCourseManagementPage.css)
const styles = {
  pageContainer: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tableContainer: {
    overflowX: 'auto', // Para tabelas responsivas
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f1f5f9', // Um cinza claro para o cabeçalho
    color: '#334155',
    padding: '15px',
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
  },
  trHover: { // Simulação de hover, melhor com CSS
    // backgroundColor: '#f8fafc',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.1rem',
    color: '#64748b',
  },
  loadingErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
  },
  // Estilos para paginação (se implementada)
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    gap: '10px',
  }
};

const AdminCourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Para o modal de formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); // Para edição

  // Para paginação (exemplo básico)
  const [currentPage, setCurrentPage] = useState(0); // Spring Pageable é 0-indexed
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Quantos cursos por página

  const navigate = useNavigate();

  const fetchCourses = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError('');
    try {
      // GET /cursos com parâmetros de paginação
      const response = await apiClient.get(`/cursos?page=${page}&size=${size}&sort=nome,asc`);
      setCourses(response.data.content || []); // 'content' é comum em respostas paginadas do Spring
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(response.data.number || 0);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError('Não foi possível carregar os cursos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(currentPage, pageSize);
  }, [fetchCourses, currentPage, pageSize]);

  const handleOpenModal = (course = null) => {
    setCurrentCourse(course); // Se null, é para criar novo
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
  };

  const handleSaveCourse = async (courseData) => {
    setLoading(true); // Pode ter um loading específico para o save
    try {
      if (currentCourse && currentCourse.id_curso) {
        // Editar curso
        await apiClient.put(`/cursos/${currentCourse.id_curso}`, courseData);
      } else {
        // Criar novo curso
        await apiClient.post('/cursos', courseData);
      }
      handleCloseModal();
      fetchCourses(currentPage, pageSize); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao salvar curso:", err);
      setError(err.response?.data?.message || 'Erro ao salvar curso.');
      // Não fechar o modal em caso de erro para o usuário corrigir
      return Promise.reject(err); // Propaga o erro para o formulário
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id_curso) => {
    if (window.confirm('Tem certeza que deseja excluir este curso e todo o seu conteúdo (módulos, atividades, etc.)? Esta ação é irreversível.')) {
      setLoading(true);
      try {
        await apiClient.delete(`/cursos/${id_curso}`);
        fetchCourses(currentPage, pageSize); // Recarrega a lista
        // Se estiver na última página e ela ficar vazia após a exclusão, volte uma página
        if (courses.length === 1 && currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
      } catch (err) {
        console.error("Erro ao excluir curso:", err);
        setError(err.response?.data?.message ||'Erro ao excluir curso.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleManageModules = (id_curso, courseName) => {
    // Navega para uma página de gerenciamento de módulos, passando o id_curso
    // Você precisará criar esta rota e página: AdminModuleManagementPage
    navigate(`/admin/cursos/${id_curso}/modulos`, { state: { courseName } });
  };


  if (loading && courses.length === 0) { // Mostra loading inicial apenas se não houver cursos já carregados
    return <div style={styles.loadingErrorContainer}>Carregando cursos...</div>;
  }

  if (error && courses.length === 0) {
    return <div style={styles.loadingErrorContainer}><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Gerenciar Cursos</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Adicionar Novo Curso
        </Button>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

      {courses.length === 0 && !loading ? (
        <div style={styles.emptyState}>
          <p>Nenhum curso encontrado. Que tal adicionar o primeiro?</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome do Curso</th>
                <th style={styles.th}>Nível</th>
                {/* Adicionar mais colunas se necessário (ex: Nº de Módulos, Status) */}
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id_curso} /* onMouseEnter/Leave para simular hover ou usar CSS */ >
                  <td style={styles.td}>{course.nome}</td>
                  <td style={styles.td}>{course.nivel_dificuldade || 'N/A'}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <Button variant="outline" size="small" onClick={() => handleManageModules(course.id_curso, course.nome)}>
                        Módulos
                      </Button>
                      <Button variant="secondary" size="small" onClick={() => handleOpenModal(course)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDeleteCourse(course.id_curso)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={styles.paginationContainer}>
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
            disabled={currentPage === 0 || loading}
          >
            Anterior
          </Button>
          <span>Página {currentPage + 1} de {totalPages}</span>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} 
            disabled={currentPage === totalPages - 1 || loading}
          >
            Próxima
          </Button>
        </div>
      )}


      {isModalOpen && (
        <CourseFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCourse}
          initialData={currentCourse}
        />
      )}
    </div>
  );
};

export default AdminCourseManagementPage;