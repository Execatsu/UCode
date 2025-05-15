import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosInstance'; // Para buscar cursos em destaque
import CourseCard from '../../components/specific/CourseCard'; // Supondo que você crie este componente
import Button from '../../components/common/Button'; // Supondo que você crie este componente

// Estilos básicos (você pode mover para um arquivo CSS: HomePage.css)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  heroSection: {
    backgroundColor: '#4a90e2', // Um azul atraente
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(80vh - 60px)', // 60px para um possível Navbar
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
    maxWidth: '800px',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '40px',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
  },
  section: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '40px',
    color: '#333',
  },
  coursesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  benefitsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    marginTop: '20px',
  },
  benefitItem: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '30px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  },
  benefitIcon: { // Você usaria ícones SVG ou FontAwesome aqui
    fontSize: '2.5rem',
    color: '#4a90e2',
    marginBottom: '15px',
  },
  benefitTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '30px 20px',
    marginTop: '40px',
  },
  footerLink: {
    color: '#aaa',
    margin: '0 10px',
    textDecoration: 'none',
  }
};

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState('');

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      setLoadingCourses(true);
      setErrorCourses('');
      try {
        // Ajuste o endpoint conforme sua API (ex: /cursos?destaque=true&limite=3)
        // Usando um limite simples para este exemplo
        const response = await apiClient.get('/cursos?page=0&size=3'); // Assumindo paginação no backend
        setFeaturedCourses(response.data.content || response.data); // Adapte conforme a estrutura da sua resposta
      } catch (err) {
        console.error("Erro ao buscar cursos em destaque:", err);
        // Não mostra erro na home para não poluir, mas loga.
        // setErrorCourses('Não foi possível carregar os cursos em destaque.');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Desbloqueie Seu Potencial com Nossos Cursos Online</h1>
        <p style={styles.heroSubtitle}>
          Aprenda as habilidades do futuro, no seu ritmo, com instrutores especialistas e uma comunidade vibrante.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/cursos">
            <Button variant="primary" size="large">Explorar Cursos</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="large">Criar Conta</Button>
          </Link>
        </div>
      </section>

      {/* Cursos em Destaque */}
      { (loadingCourses || featuredCourses.length > 0) && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Cursos em Destaque</h2>
          {loadingCourses && <p>Carregando cursos...</p>}
          {errorCourses && <p style={{ color: 'red' }}>{errorCourses}</p>}
          {!loadingCourses && featuredCourses.length > 0 && (
            <div style={styles.coursesGrid}>
              {featuredCourses.map(course => (
                <CourseCard key={course.id_curso} course={course} />
              ))}
            </div>
          )}
          {!loadingCourses && featuredCourses.length === 0 && !errorCourses && (
             <p>Volte em breve para novos cursos!</p>
          )}
        </section>
      )}

      {/* Seção de Benefícios */}
      <section style={{...styles.section, backgroundColor: '#f7faff'}}>
        <h2 style={styles.sectionTitle}>Por Que Aprender Conosco?</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>💡</div> {/* Substitua por um ícone real */}
            <h3 style={styles.benefitTitle}>Conteúdo Atualizado</h3>
            <p>Cursos relevantes e alinhados com as demandas do mercado.</p>
          </div>
          <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>🎓</div> {/* Substitua por um ícone real */}
            <h3 style={styles.benefitTitle}>Instrutores Especialistas</h3>
            <p>Aprenda com profissionais experientes e apaixonados pelo que fazem.</p>
          </div>
          <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>💻</div> {/* Substitua por um ícone real */}
            <h3 style={styles.benefitTitle}>Aprenda no Seu Ritmo</h3>
            <p>Acesso flexível para você estudar quando e onde preferir.</p>
          </div>
           <div style={styles.benefitItem}>
            <div style={styles.benefitIcon}>🌟</div> {/* Substitua por um ícone real */}
            <h3 style={styles.benefitTitle}>Certificados de Conclusão</h3>
            <p>Valide suas novas habilidades e impulsione sua carreira.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Pronto para Começar Sua Jornada?</h2>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
          Junte-se a milhares de alunos e transforme seu conhecimento em oportunidades.
        </p>
        <Link to="/cursos">
          <Button variant="primary" size="large">Ver Todos os Cursos</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Minha Plataforma de Cursos. Todos os direitos reservados.</p>
        <p>
          <Link to="/sobre" style={styles.footerLink}>Sobre Nós</Link>
          <Link to="/contato" style={styles.footerLink}>Contato</Link>
          <Link to="/termos" style={styles.footerLink}>Termos de Uso</Link>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;