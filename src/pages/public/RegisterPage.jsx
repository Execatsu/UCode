import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Usaremos o método register do AuthContext
import Button from '../../components/common/Button'; // Reutilizando o componente Button
import Input from '../../components/common/Input'; // Reutilizando o componente Input

// Estilos básicos (você pode mover para um arquivo CSS: RegisterPage.css)
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)', // 60px para um possível Navbar
    padding: '20px',
    backgroundColor: '#f4f7f6',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '15px',
    textAlign: 'left',
  },
  successMessage: {
    color: 'green',
    fontSize: '0.9rem',
    marginBottom: '15px',
  },
  loginLink: {
    marginTop: '25px',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    login: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nome || !formData.login || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Todos os campos são obrigatórios.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return false;
    }
    if (formData.senha.length < 6) { // Exemplo simples de validação de senha
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // O backend espera: nome, login, senha_hash, email.
      // A senha será "hasheada" no backend. Aqui enviamos a senha em texto plano.
      // O endpoint '/auth/registrar' já foi definido para receber nome, login, senha, email.
      const registrationData = {
        nome: formData.nome,
        login: formData.login,
        email: formData.email,
        senha: formData.senha, // O backend cuidará do hash
      };

      await auth.register(registrationData);
      setSuccessMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      // Opcional: Limpar formulário
      setFormData({ nome: '', login: '', email: '', senha: '', confirmarSenha: '' });
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redireciona após 3 segundos
    } catch (err) {
      setError(err.message || 'Ocorreu um erro durante o cadastro. Tente novamente.');
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Crie Sua Conta</h2>
        <p style={styles.subtitle}>É rápido e fácil. Comece a aprender hoje mesmo!</p>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <Input
            label="Nome Completo"
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
          />
          <Input
            label="Nome de Usuário (Login)"
            type="text"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Escolha um login único"
            required
          />
          <Input
            label="E-mail"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu.email@exemplo.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            placeholder="Repita sua senha"
            required
          />
          <Button type="submit" variant="primary" disabled={loading} fullWidth>
            {loading ? 'Registrando...' : 'Criar Conta'}
          </Button>
        </form>

        <p style={styles.loginLink}>
          Já tem uma conta?{' '}
          <Link to="/login" style={styles.link}>
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;