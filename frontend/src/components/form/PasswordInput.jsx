import React, { useState } from 'react';

/**
 * Componente de input de senha com opção de mostrar/ocultar
 * 
 * @param {Object} props
 * @param {string} props.id - ID do campo
 * @param {string} props.name - Nome do campo
 * @param {string} props.value - Valor atual do campo
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {string} props.label - Label do campo
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.className - Classes adicionais para o componente
 */
const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  label = "Senha",
  placeholder = " ",
  className = "",
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative border ${
        isFocused ? 'border-accent-300 dark:border-accent-200' : 'border-gray-300 dark:border-gray-600'
      } rounded-lg transition-all duration-150 shadow-sm overflow-hidden`}>
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="block w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-white dark:bg-dark-300 appearance-none focus:outline-none"
          {...otherProps}
        />
        
        <label
          htmlFor={id}
          className={`absolute text-sm ${
            isFocused || value
              ? 'transform -translate-y-2 scale-90 top-2 text-accent-300 dark:text-accent-200'
              : 'top-4 text-gray-500 dark:text-gray-400'
          } left-4 transition-all duration-150 pointer-events-none`}
        >
          {label}
        </label>
        
        {/* Ícone de olho para mostrar/ocultar senha */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-accent-300 transition-colors duration-150"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
