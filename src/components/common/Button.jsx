import React from 'react';
import PropTypes from 'prop-types';

// Estilos base e variantes (mova para um arquivo CSS ou use CSS-in-JS)
// Estes são estilos inline para demonstração. Em um projeto real, use classes CSS.
const baseStyles = {
  fontFamily: 'Arial, sans-serif',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 20px', // Default (medium size)
  cursor: 'pointer',
  fontSize: '1rem', // Default (medium size)
  fontWeight: '500',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none', // Para variantes de link
  lineHeight: '1.5',
};

const variantStyles = {
  primary: {
    backgroundColor: '#007bff', // Azul primário
    color: 'white',
    border: '1px solid #007bff',
  },
  secondary: {
    backgroundColor: '#6c757d', // Cinza secundário
    color: 'white',
    border: '1px solid #6c757d',
  },
  danger: {
    backgroundColor: '#dc3545', // Vermelho perigo
    color: 'white',
    border: '1px solid #dc3545',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#007bff', // Cor do texto igual à primária
    border: '1px solid #007bff',
  },
  link: {
    backgroundColor: 'transparent',
    color: '#007bff', // Cor do texto igual à primária
    border: 'none',
    padding: '0', // Links geralmente não têm padding interno grande
    textDecoration: 'underline',
    fontWeight: 'normal',
  },
  disabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
  },
};

const sizeStyles = {
  small: {
    padding: '6px 12px',
    fontSize: '0.875rem',
  },
  medium: {
    padding: '10px 20px',
    fontSize: '1rem',
  },
  large: {
    padding: '12px 24px',
    fontSize: '1.125rem',
  },
};

const hoverStyles = { // Simulação de hover, melhor com CSS
  primary: { backgroundColor: '#0056b3', borderColor: '#0056b3' },
  secondary: { backgroundColor: '#545b62', borderColor: '#545b62' },
  danger: { backgroundColor: '#c82333', borderColor: '#c82333' },
  outline: { backgroundColor: 'rgba(0, 123, 255, 0.1)' }, // Fundo leve no hover
  link: { color: '#0056b3' },
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, outline, link
  size = 'medium',    // small, medium, large
  disabled = false,
  fullWidth = false,
  className = '',     // Para classes CSS externas
  iconLeft,           // Componente de ícone para a esquerda
  iconRight,          // Componente de ícone para a direita
  style,              // Para estilos inline adicionais
  ...props            // Outros props HTML como 'aria-label', etc.
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? variantStyles.disabled : {}),
    ...(isHovered && !disabled && hoverStyles[variant] ? hoverStyles[variant] : {}), // Aplica hover
    ...style, // Permite sobrescrever com estilos inline
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyles}
      className={`btn btn-${variant} btn-${size} ${className} ${fullWidth ? 'btn-fullwidth' : ''}`} // Classes para estilização CSS externa
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {iconLeft && <span style={{ marginRight: children ? '8px' : '0' }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ marginLeft: children ? '8px' : '0' }}>{iconRight}</span>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'link']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  style: PropTypes.object,
};

export default Button;