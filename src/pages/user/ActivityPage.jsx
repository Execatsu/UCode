import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

// Estilos básicos (mova para ActivityPage.css)
const styles = {
  pageContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  loadingErrorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
  },
  activityHeader: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  activityTitle: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  questionContainer: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  questionDescription: {
    fontSize: '1.3rem',
    lineHeight: '1.6',
    color: '#34495e',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap', // Para respeitar quebras de linha da descrição da questão
  },
  alternativesList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  alternativeItem: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    '&:hover': { // Estilo de hover (melhor com CSS)
      backgroundColor: '#e9ecef',
    },
  },
  selectedAlternative: {
    backgroundColor: '#4a90e2',
    color: 'white',
    borderColor: '#4a90e2',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  resultsContainer: {
    marginTop: '40px',
    padding: '30px',
    backgroundColor: '#e6ffed', // Verde claro para sucesso
    border: '1px solid #b2d8b5',
    borderRadius: '8px',
  },
  resultsTitle: {
    fontSize: '1.8rem',
    color: '#155724',
    marginBottom: '15px',
  },
  resultsText: {
    fontSize: '1.1rem',
    color: '#155724',
    marginBottom: '10px',
  },
  explanationBox: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderLeft: '4px solid #4a90e2',
  },
  feedbackCorrect: {
    border: '2px solid green',
    backgroundColor: '#e6ffed',
  },
  feedbackIncorrect: {
    border: '2px solid red',
    backgroundColor: '#ffe6e6',
  },
  feedbackCorrectAlternative: {
    fontWeight: 'bold',
    color: 'green',
  }
};

const ActivityPage = () => {
  const { id_atividade } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { id_questao: id_alternativa_escolhida }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null); // Para armazenar o resultado da submissão

  const fetchActivityData = useCallback(async () => {
    if (!id_atividade) return;
    setLoading(true);
    setError('');
    setResults(null); // Limpa resultados anteriores ao recarregar
    setUserAnswers({}); // Limpa respostas anteriores
    setCurrentQuestionIndex(0);

    try {
      // GET /atividades/{id_atividade} deve retornar a atividade e suas questões com alternativas
      // Ex: { id_atividade: 1, nome: "Quiz Inicial", questoes: [ { id_questao: 1, descricao: "...", tipo: "MULTIPLA_ESCOLHA", alternativas: [{id_alternativa: 1, descricao: "..."}] } ] }
      const response = await apiClient.get(`/atividades/${id_atividade}`);
      setActivity(response.data);
      setQuestions(response.data.questoes || []); // Garante que questoes seja um array
    } catch (err) {
      console.error("Erro ao buscar dados da atividade:", err);
      setError('Não foi possível carregar a atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [id_atividade]);

  useEffect(() => {
    // Espera o usuário ser carregado antes de buscar dados da atividade
    if (!authLoading && user) {
      fetchActivityData();
    } else if (!authLoading && !user) {
      // Se não está autenticado, redireciona para o login
      navigate('/login', { state: { from: `/atividade/${id_atividade}` } });
    }
  }, [id_atividade, user, authLoading, fetchActivityData, navigate]);

  const handleSelectAlternative = (id_questao, id_alternativa) => {
    if (results) return; // Não permite mudar resposta após submissão

    setUserAnswers(prev => ({
      ...prev,
      [id_questao]: id_alternativa,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAnswers = async () => {
    if (Object.keys(userAnswers).length !== questions.length) {
        alert('Por favor, responda todas as questões antes de submeter.');
        return;
    }
    setSubmitting(true);
    setError('');
    try {
      const submissionData = {
        id_usuario: user.id_usuario,
        id_atividade: parseInt(id_atividade),
        // O backend espera: respostas_submetidas: [ { "id_questao": int, "id_alternativa_escolhida": int_ou_null, "resposta_texto": string_ou_null } ]
        // Adaptar conforme o tipo da questão, aqui focamos em múltipla escolha
        respostas_submetidas: Object.entries(userAnswers).map(([id_questao, id_alternativa_escolhida]) => ({
          id_questao: parseInt(id_questao),
          id_alternativa_escolhida: id_alternativa_escolhida,
          resposta_texto: null, // Para questões de texto
        })),
      };
      // POST /progresso
      const response = await apiClient.post('/progresso', submissionData);
      setResults(response.data); // Resposta esperada: { pontuacao, erros, data_conclusao, feedbackQuestoes: [{id_questao, acertou, id_alternativa_correta, explicacao_pos_resposta}] }
      // A atualização do XP, moedas, etc. é feita no backend
    } catch (err) {
      console.error("Erro ao submeter respostas:", err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao submeter suas respostas.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div style={styles.loadingErrorContainer}>Carregando atividade...</div>;
  }

  if (error) {
    return <div style={styles.loadingErrorContainer}><p style={{color: 'red'}}>{error}</p></div>;
  }

  if (!activity || questions.length === 0) {
    return <div style={styles.loadingErrorContainer}>Esta atividade não possui questões ou não foi encontrada.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Renderização do conteúdo principal (questões ou resultados)
  const renderContent = () => {
    if (results) {
      return (
        <div style={styles.resultsContainer}>
          <h2 style={styles.resultsTitle}>Resultados da Atividade</h2>
          <p style={styles.resultsText}><strong>Sua Pontuação:</strong> {results.pontuacao}</p>
          <p style={styles.resultsText}><strong>Erros:</strong> {results.erros}</p>
          <p style={styles.resultsText}><strong>Concluído em:</strong> {new Date(results.data_conclusao).toLocaleString()}</p>

          <h3 style={{ marginTop: '30px', color: '#333' }}>Feedback das Questões:</h3>
          {questions.map((q, index) => {
            const feedback = results.feedbackQuestoes?.find(f => f.id_questao === q.id_questao);
            const userAnswerForThisQuestion = userAnswers[q.id_questao];

            return (
              <div key={q.id_questao} style={{...styles.questionContainer, marginBottom: '15px', ...(feedback ? (feedback.acertou ? styles.feedbackCorrect : styles.feedbackIncorrect) : {}) }}>
                <p style={styles.questionDescription}><strong>{index + 1}.</strong> {q.descricao}</p>
                <ul style={styles.alternativesList}>
                    {q.alternativas.map(alt => (
                        <li
                            key={alt.id_alternativa}
                            style={{
                                ...styles.alternativeItem,
                                ...(userAnswerForThisQuestion === alt.id_alternativa ? styles.selectedAlternative : {}),
                                ...(feedback && feedback.id_alternativa_correta === alt.id_alternativa ? styles.feedbackCorrectAlternative : {}),
                                cursor: 'default' // Desabilita cursor pointer no resultado
                            }}
                        >
                            {alt.descricao}
                            {userAnswerForThisQuestion === alt.id_alternativa && (feedback ? (feedback.acertou ? " (Sua resposta - Correta ✔️)" : " (Sua resposta - Incorreta ❌)") : "")}
                            {feedback && feedback.id_alternativa_correta === alt.id_alternativa && userAnswerForThisQuestion !== alt.id_alternativa && " (Correta ✔️)"}
                        </li>
                    ))}
                </ul>
                {feedback && feedback.explicacao_pos_resposta && (
                  <div style={styles.explanationBox}>
                    <strong>Explicação:</strong> {feedback.explicacao_pos_resposta}
                  </div>
                )}
              </div>
            );
          })}
          <Button onClick={() => navigate(`/cursos/${activity.id_curso || ''}`)} style={{marginTop: '20px'}}> {/* Assumindo que atividade tem id_curso */}
            Voltar ao Curso
          </Button>
        </div>
      );
    }

    // Se não há resultados, mostra a questão atual
    return (
      <>
        <div style={styles.questionContainer}>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
            Questão {currentQuestionIndex + 1} de {questions.length}
          </p>
          <p style={styles.questionDescription}>{currentQuestion.descricao}</p>
          {currentQuestion.tipo === 'MULTIPLA_ESCOLHA' && currentQuestion.alternativas && (
            <ul style={styles.alternativesList}>
              {currentQuestion.alternativas.map(alt => (
                <li
                  key={alt.id_alternativa}
                  style={{
                    ...styles.alternativeItem,
                    ...(userAnswers[currentQuestion.id_questao] === alt.id_alternativa ? styles.selectedAlternative : {})
                  }}
                  onClick={() => handleSelectAlternative(currentQuestion.id_questao, alt.id_alternativa)}
                >
                  {alt.descricao}
                </li>
              ))}
            </ul>
          )}
          {/* Adicionar aqui lógica para outros tipos de questão (ex: input de texto) */}
        </div>

        <div style={styles.navigationButtons}>
          <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Anterior
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Próxima
            </Button>
          ) : (
            <Button onClick={handleSubmitAnswers} variant="primary" disabled={submitting || Object.keys(userAnswers).length !== questions.length}>
              {submitting ? 'Enviando...' : 'Finalizar Atividade'}
            </Button>
          )}
        </div>
      </>
    );
  };


  return (
    <div style={styles.pageContainer}>
      <header style={styles.activityHeader}>
        <h1 style={styles.activityTitle}>{activity.nome || `Atividade ${id_atividade}`}</h1>
        {/* Adicionar mais detalhes da atividade se necessário */}
      </header>

      {renderContent()}

    </div>
  );
};

export default ActivityPage;