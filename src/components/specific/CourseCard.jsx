import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Estilos básicos (mova para CourseCard.css ou CourseCard.module.css)
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', // Para garantir que a imagem não ultrapasse as bordas arredondadas
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    textDecoration: 'none', // Remove sublinhado do Link
    color: 'inherit', // Herda a cor do texto
    height: '100%', // Para que todos os cards em uma grade tenham a mesma altura se o contêiner pai usar display: grid
  },
  cardHover: { // Simulação de hover, melhor com CSS
    // transform: 'translateY(-5px)',
    // boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
  },
  imageContainer: {
    width: '100%',
    height: '180px', // Altura fixa para a imagem
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Garante que a imagem cubra o espaço sem distorcer
    transition: 'transform 0.3s ease',
  },
  imageHover: { // Simulação de zoom na imagem no hover do card
    // transform: 'scale(1.05)',
  },
  content: {
    padding: '20px',
    flexGrow: 1, // Faz o conteúdo ocupar o espaço restante
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    // Limitar a duas linhas com ellipsis (melhor com CSS)
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '2.6rem', // Para duas linhas de texto (1.3rem * 2)
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '15px',
    flexGrow: 1, // Para empurrar o footer para baixo
    // Limitar a 3 linhas com ellipsis (melhor com CSS)
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '4.05rem', // Para 3 linhas (0.9rem * 1.5 line-height * 3) - ajuste line-height
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Empurra para o final se o conteúdo acima não preencher
  },
  level: {
    fontSize: '0.85rem',
    color: '#555',
    backgroundColor: '#e9ecef',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  actionButton: { // Estilo para um botão "Ver Curso" se você não quiser o card inteiro clicável
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    border: 'none',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50', // Verde para progresso
    borderRadius: '4px',
    transition: 'width 0.3s ease-in-out',
  }
};

const CourseCard = ({ course, showProgress = false, progressPercent = 0 }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  if (!course) {
    return null; // Ou um placeholder de card de carregamento
  }

  const { id_curso, nome, descricao, imagem_capa, nivel_dificuldade } = course;

  const cardStyle = {
    ...styles.card,
    ...(isHovered ? styles.cardHover : {}),
  };

  const imageStyle = {
    ...styles.image,
    ...(isHovered ? styles.imageHover : {}),
  };

  return (
    <Link
      to={`/cursos/${id_curso}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Ver detalhes do curso ${nome}`}
    >
      <div style={styles.imageContainer}>
        <img
          src={imagem_capa || 'https://via.placeholder.com/400x200?text=Curso'} // Imagem placeholder
          alt={`Capa do curso ${nome}`}
          style={imageStyle}
        />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{nome}</h3>
        {descricao && <p style={styles.description}>{descricao}</p>}
        
        <div style={styles.footer}>
          {nivel_dificuldade && <span style={styles.level}>{nivel_dificuldade}</span>}
          {/* Você pode adicionar um botão aqui se não quiser o card inteiro como link */}
          {/* <button style={styles.actionButton}>Ver Curso</button> */}
        </div>

        {showProgress && (
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progressPercent}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id_curso: PropTypes.number.isRequired,
    nome: PropTypes.string.isRequired,
    descricao: PropTypes.string,
    imagem_capa: PropTypes.string,
    nivel_dificuldade: PropTypes.string,
  }).isRequired,
  showProgress: PropTypes.bool, // Para exibir a barra de progresso
  progressPercent: PropTypes.number, // Percentual de progresso (0-100)
};

export default CourseCard;    