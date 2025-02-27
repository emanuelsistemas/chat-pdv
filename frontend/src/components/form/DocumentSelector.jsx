import { useState, useEffect } from 'react';
import MaskedInput from './MaskedInput';
import { 
  validateDocument, 
  getDocumentMask
} from '../../utils/documentValidation';

/**
 * Componente para seleção e entrada de documentos (CNPJ/CPF)
 * 
 * @param {Object} props
 * @param {string} props.value - Valor atual do documento
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {string} props.defaultDocumentType - Tipo de documento padrão ('cnpj' ou 'cpf')
 * @param {boolean} props.showValidation - Se deve mostrar validação visual
 * @param {Function} props.onValidationChange - Função chamada quando o status de validação muda
 * @param {boolean} props.enableSearch - Se deve mostrar ícone de lupa para busca (apenas para CNPJ)
 * @param {Function} props.onSearchClick - Função chamada quando o ícone de busca é clicado
 * @param {Function} props.onDocumentTypeChange - Função chamada quando o tipo de documento muda
 * @param {string} props.className - Classes adicionais para o componente
 */
const DocumentSelector = ({
  value = '',
  onChange,
  defaultDocumentType = 'cnpj',
  showValidation = false,
  onValidationChange,
  enableSearch = true,
  onSearchClick,
  onDocumentTypeChange,
  className = ''
}) => {
  // Estado para armazenar o tipo de documento selecionado (cnpj ou cpf)
  const [documentType, setDocumentType] = useState(defaultDocumentType);
  
  // Estado para armazenar se o documento é válido
  const [isValid, setIsValid] = useState(null);
  
  // Estado para controlar quando o input está focado
  const [isFocused, setIsFocused] = useState(false);
  
  // Verifica a validade do documento quando o valor ou tipo muda
  useEffect(() => {
    // Só validamos se tiver um valor
    if (value && value.trim().length > 0) {
      const valid = validateDocument(value, documentType);
      setIsValid(valid);
      
      if (onValidationChange) {
        onValidationChange(valid);
      }
    } else {
      setIsValid(null);
      
      if (onValidationChange) {
        onValidationChange(null);
      }
    }
  }, [value, documentType, onValidationChange]);
  
  // Função para lidar com a mudança no tipo de documento
  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    
    // Notifica o componente pai sobre a mudança no tipo de documento
    if (onDocumentTypeChange) {
      onDocumentTypeChange(type);
    }
    
    // Limpa o valor quando muda o tipo de documento
    if (onChange) {
      // Adiciona o tipo de documento no evento para que o componente pai saiba qual tipo foi selecionado
      onChange({ 
        target: { name: 'documento', value: '' },
        documentType: type
      });
    }
  };
  
  // Lupa para busca (apenas se enableSearch=true e documentType=cnpj)
  const searchIcon = (documentType === 'cnpj' && enableSearch) ? (
    <button 
      type="button" 
      onClick={() => onSearchClick && onSearchClick(value)}
      className="cursor-pointer text-gray-500 hover:text-accent-300 transition-colors duration-150 absolute right-2 top-1/2 transform -translate-y-1/2"
      aria-label="Buscar CNPJ"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </button>
  ) : null;
  
  // Define classes com base na validação (se showValidation=true)
  const getInputClasses = () => {
    let baseClasses = "block w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-white dark:bg-dark-300 appearance-none focus:outline-none";
    
    if (!showValidation || isValid === null) {
      return baseClasses;
    }
    
    if (isValid) {
      return `${baseClasses} border-green-500 focus:border-green-500`;
    }
    
    return `${baseClasses} border-red-500 focus:border-red-500`;
  };
  
  return (
    <div className={className}>
      {/* Toggle para seleção de tipo de documento */}
      <div className="flex mb-2">
        <div className="flex bg-gray-100 dark:bg-dark-400 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleDocumentTypeChange('cnpj')}
            className={`py-1 px-3 rounded-md text-sm font-medium transition-colors duration-150 ${
              documentType === 'cnpj' 
                ? 'bg-white dark:bg-dark-300 text-accent-300 dark:text-accent-200 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            CNPJ
          </button>
          
          <button
            type="button"
            onClick={() => handleDocumentTypeChange('cpf')}
            className={`py-1 px-3 rounded-md text-sm font-medium transition-colors duration-150 ${
              documentType === 'cpf' 
                ? 'bg-white dark:bg-dark-300 text-accent-300 dark:text-accent-200 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            CPF
          </button>
        </div>
      </div>
      
      {/* Campo de entrada do documento com máscara */}
      <div className={`relative border ${
        isFocused ? 'border-accent-300 dark:border-accent-200' : 'border-gray-300 dark:border-gray-600'
      } rounded-lg transition-all duration-150 shadow-sm overflow-hidden`}>
        <MaskedInput
          id="documento"
          name="documento"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mask={getDocumentMask(documentType)}
          className={getInputClasses()}
          placeholder=" "
        />
        
        {/* Ícone de lupa para busca */}
        {searchIcon}
        
        <label
          htmlFor="documento"
          className={`absolute text-sm ${
            isFocused || value
              ? 'transform -translate-y-2 scale-90 top-2 text-accent-300 dark:text-accent-200'
              : 'top-4 text-gray-500 dark:text-gray-400'
          } left-4 transition-all duration-150 pointer-events-none`}
        >
          {documentType === 'cnpj' ? 'CNPJ' : 'CPF'}
        </label>
      </div>
      
      {/* Mensagem de validação (opcional) */}
      {showValidation && isValid !== null && (
        <div className={`mt-1 text-xs ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid 
            ? (documentType === 'cnpj' ? 'CNPJ válido' : 'CPF válido') 
            : (documentType === 'cnpj' ? 'CNPJ inválido' : 'CPF inválido')}
        </div>
      )}
    </div>
  );
};

export default DocumentSelector;
