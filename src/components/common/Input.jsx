import React from 'react';

const styles = {
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '0.9rem',
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1rem',
  },
  inputError: {
    borderColor: 'red',
  }
};

const Input = ({ label, type, id, name, value, onChange, placeholder, required, error }) => {
  return (
    <div style={styles.inputGroup}>
      {label && <label htmlFor={id} style={styles.label}>{label}{required && '*'}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {/* Você pode adicionar uma mensagem de erro específica do campo aqui se desejar */}
    </div>
  );
};

export default Input;