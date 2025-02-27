import { useState, useRef, useEffect } from 'react';

/**
 * Componente de dropdown pesquisável reutilizável
 * 
 * @param {Object} props
 * @param {string} props.label - Texto a ser exibido quando nenhum item for selecionado
 * @param {string} props.value - Valor atualmente selecionado
 * @param {Array} props.options - Array de opções para o dropdown
 * @param {Function} props.onChange - Função chamada quando uma opção é selecionada
 * @param {string} props.searchPlaceholder - Texto do placeholder do campo de busca
 * @param {string} props.noResultsText - Texto exibido quando nenhum resultado é encontrado
 * @param {string} props.className - Classes adicionais para o componente
 */
const SearchableDropdown = ({
  label = "Selecione uma opção",
  value = "",
  options = [],
  onChange,
  searchPlaceholder = "Buscar...",
  noResultsText = "Nenhum resultado encontrado",
  className = ""
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  // Filtrar as opções com base no termo de pesquisa
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fechar o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    onChange(option);
    setSearchTerm('');
    setDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center justify-between w-full px-4 py-3 text-left ${
            value 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          } bg-white dark:bg-dark-300 border ${
            dropdownOpen 
              ? 'border-accent-300 dark:border-accent-200' 
              : 'border-gray-300 dark:border-gray-600'
          } rounded-lg transition-all duration-150 shadow-sm`}
        >
          <span>
            {value || label}
          </span>
          <svg 
            className={`w-5 h-5 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        
        {dropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-300 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-dark-300 p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-dark-400 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-300 dark:focus:ring-accent-200"
              />
            </div>
            
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-400"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                {noResultsText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
