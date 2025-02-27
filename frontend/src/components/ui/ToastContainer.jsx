import React from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';

/**
 * Componente para gerenciar e exibir múltiplas notificações Toast
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Lista de toasts a serem exibidos
 * @param {Function} props.removeToast - Função para remover um toast
 */
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs w-full flex flex-col items-end">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      duration: PropTypes.number
    })
  ).isRequired,
  removeToast: PropTypes.func.isRequired
};

export default ToastContainer;
