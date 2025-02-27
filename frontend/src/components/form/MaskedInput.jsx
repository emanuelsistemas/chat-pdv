import React from 'react';
import { IMaskInput } from 'react-imask';

/**
 * Componente para entrada de texto com máscara
 * 
 * @param {Object} props
 * @param {string} props.id - ID do campo
 * @param {string} props.name - Nome do campo
 * @param {string} props.value - Valor atual do campo
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {Function} props.onFocus - Função chamada quando o campo ganha foco
 * @param {Function} props.onBlur - Função chamada quando o campo perde foco
 * @param {string} props.mask - Máscara a ser aplicada (ex: "000.000.000-00")
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.className - Classes adicionais para o componente
 * @param {boolean} props.readOnly - Se o campo é somente leitura
 * @param {boolean} props.disabled - Se o campo está desabilitado
 */
const MaskedInput = ({
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  mask,
  placeholder = " ",
  className = "",
  readOnly = false,
  disabled = false,
  ...otherProps
}) => {
  // Converte a máscara no formato antigo para o formato do IMask
  const getImaskOptions = () => {
    // Se a máscara contém apenas 9's, é uma máscara de números
    if (/^[9]*$/.test(mask.replace(/[^9]/g, ''))) {
      return {
        mask,
        definitions: {
          '9': /[0-9]/
        }
      };
    }
    
    // Para máscaras de CNPJ e CPF, usamos formatos específicos
    if (mask === '999.999.999-99') {
      return {
        mask: '000.000.000-00',
      };
    }
    
    if (mask === '99.999.999/9999-99') {
      return {
        mask: '00.000.000/0000-00',
      };
    }
    
    return {
      mask,
    };
  };
  
  // Handler para converter o evento do IMask para o formato esperado pelo componente pai
  const handleAccept = (value, maskRef) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value
        }
      });
    }
  };
  
  return (
    <IMaskInput
      id={id}
      name={name}
      value={value}
      unmask={false} // Mantém os caracteres de formatação
      inputRef={(el) => {}} // Referência para o input (opcional)
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      className={className}
      {...getImaskOptions()}
      onAccept={handleAccept}
      {...otherProps}
    />
  );
};

export default MaskedInput;
