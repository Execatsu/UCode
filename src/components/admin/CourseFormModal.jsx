import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input'; // Assumindo que você tenha um componente Input

// Estilos para o Modal (mova para um arquivo CSS ou use uma lib de modal)
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  title: {
    marginTop: 0,
    marginBottom: '25px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  buttonGroup: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '10px',
  }
};

const NIVEL_DIFICULDADE_OPTIONS = [ // Obtenha isso da API ou defina como constante
    { value: 'INICIANTE', label: 'Iniciante' },
    { value: 'INTERMEDIARIO', label: 'Intermediário' },
    { value: 'AVANCADO', label: 'Avançado' },
];

const CourseFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem_capa: '',
    nivel_dificuldade: NIVEL_DIFICULDADE_OPTIONS[0]?.value || '', // Padrão para o primeiro ou string vazia
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        descricao: initialData.descricao || '',
        imagem_capa: initialData.imagem_capa || '',
        nivel_dificuldade: initialData.nivel_dificuldade || NIVEL_DIFICULDADE_OPTIONS[0]?.value,
      });
    } else {
      // Reset para novo curso
      setFormData({
        nome: '',
        descricao: '',
        imagem_capa: '',
        nivel_dificuldade: NIVEL_DIFICULDADE_OPTIONS[0]?.value,
      });
    }
    setError(''); // Limpa erro ao abrir/reabrir
  }, [initialData, isOpen]); // Re-seta o form quando initialData ou isOpen muda

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nome.trim()) {
        setError("O nome do curso é obrigatório.");
        return;
    }
    // Adicionar mais validações se necessário

    setIsSubmitting(true);
    try {
      await onSave(formData); // onSave já lida com fechar o modal em sucesso
    } catch (submissionError) {
      setError(submissionError.message || 'Erro ao salvar. Verifique os dados.');
      // Não fecha o modal automaticamente em caso de erro no onSave
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}> {/* Fechar ao clicar fora */}
      <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}> {/* Evitar fechar ao clicar dentro */}
        <button style={modalStyles.closeButton} onClick={onClose}>×</button>
        <h2 style={modalStyles.title}>{initialData ? 'Editar Curso' : 'Adicionar Novo Curso'}</h2>
        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <Input
            label="Nome do Curso"
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor="descricao" style={{display: 'block', marginBottom: '5px'}}>Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <Input
            label="URL da Imagem da Capa"
            type="text" // Ou type="file" se for fazer upload
            id="imagem_capa"
            name="imagem_capa"
            value={formData.imagem_capa}
            onChange={handleChange}
          />
          <div>
            <label htmlFor="nivel_dificuldade" style={{display: 'block', marginBottom: '5px'}}>Nível de Dificuldade</label>
            <select
              id="nivel_dificuldade"
              name="nivel_dificuldade"
              value={formData.nivel_dificuldade}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              {NIVEL_DIFICULDADE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {error && <p style={modalStyles.errorMessage}>{error}</p>}

          <div style={modalStyles.buttonGroup}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Criar Curso')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;