import React, { useState } from 'react';
import MaskedInput from './MaskedInput';

/**
 * Componente para entrada de telefone com máscara
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
const PhoneInput = ({
  id,
  name,
  value,
  onChange,
  label = "Telefone",
  placeholder = " ",
  className = "",
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Configura a máscara para telefone celular brasileiro
  const phoneMask = '(99) 9 9999-9999';

  return (
    <div className={`relative ${className}`}>
      <div className={`relative border ${
        isFocused ? 'border-accent-300 dark:border-accent-200' : 'border-gray-300 dark:border-gray-600'
      } rounded-lg transition-all duration-150 shadow-sm overflow-hidden`}>
        <MaskedInput
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mask={phoneMask}
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
      </div>
    </div>
  );
};

export default PhoneInput;
