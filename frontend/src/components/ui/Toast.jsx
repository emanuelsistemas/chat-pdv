import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Toast para exibir notificações temporárias
 * 
 * @param {Object} props
 * @param {string} props.id - ID único do toast
 * @param {string} props.message - Mensagem a ser exibida
 * @param {string} props.type - Tipo do toast (success, error, warning, info)
 * @param {number} props.duration - Duração em ms que o toast ficará visível
 * @param {Function} props.onClose - Função chamada ao fechar o toast
 */
const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Apenas configura o timer para fechamento automático se NÃO for um toast de erro
    if (type !== 'error') {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timer);
    }
    // Toasts de erro não fecham automaticamente
  }, [duration, type]);

  const handleClose = () => {
    setExit(true);
    // Pequeno delay para animação sair
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose(id);
    }, 300);
  };

  // Não renderiza se não estiver visível
  if (!visible) return null;

  // Define o ícone com base no tipo
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  // Classes com base no tipo
  const toastClasses = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-300 dark:border-green-700',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-red-300 dark:border-red-700',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700', 
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300 dark:border-blue-700'
  };

  const iconClasses = {
    success: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800',
    error: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800',
    warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800'
  };

  return (
    <div 
      className={`
        ${toastClasses[type]}
        flex items-center p-4 mb-3 rounded-lg shadow-md border
        transform transition-all duration-300 ease-in-out
        ${exit ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        backdrop-blur-md
        ${type === 'error' ? 'max-w-md' : 'max-w-xs'}
      `}
      role="alert"
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${iconClasses[type]}`}>
        {renderIcon()}
      </div>
      <div className="ml-3 text-sm font-medium whitespace-pre-wrap">{message}</div>
      <button 
        type="button" 
        onClick={handleClose}
        className={`
          ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8
          hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
          ${type === 'success' ? 'focus:ring-green-400' : ''}
          ${type === 'error' ? 'focus:ring-red-400' : ''}
          ${type === 'warning' ? 'focus:ring-yellow-400' : ''}
          ${type === 'info' ? 'focus:ring-blue-400' : ''}
        `}
        aria-label="Fechar"
      >
        <span className="sr-only">Fechar</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func
};

export default Toast;
