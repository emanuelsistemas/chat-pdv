/**
 * Utilitários para validação e formatação de documentos brasileiros
 */

/**
 * Remove caracteres não numéricos de uma string
 * @param {string} value - String a ser limpa
 * @returns {string} String contendo apenas números
 */
export const removeNonDigits = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

/**
 * Valida se um CPF é válido
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean} true se o CPF for válido, false caso contrário
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = removeNonDigits(cpf);
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  // Cálculo de validação do CPF
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
  }
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false;
  }
  
  return true;
};

/**
 * Valida se um CNPJ é válido
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean} true se o CNPJ for válido, false caso contrário
 */
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  // Remove caracteres não numéricos
  cnpj = removeNonDigits(cnpj);
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }
  
  // Cálculo de validação do CNPJ
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }
  
  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }
  
  return true;
};

/**
 * Formata um CPF com pontos e traço
 * @param {string} cpf - CPF sem formatação (apenas números)
 * @returns {string} CPF formatado (000.000.000-00)
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  cpf = removeNonDigits(cpf);
  
  if (cpf.length !== 11) {
    return cpf;
  }
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um CNPJ com pontos, barra e traço
 * @param {string} cnpj - CNPJ sem formatação (apenas números)
 * @returns {string} CNPJ formatado (00.000.000/0000-00)
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  cnpj = removeNonDigits(cnpj);
  
  if (cnpj.length !== 14) {
    return cnpj;
  }
  
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Retorna a máscara correspondente ao tipo de documento
 * @param {string} documentType - Tipo de documento ('cpf' ou 'cnpj')
 * @returns {string} Máscara para o tipo de documento
 */
export const getDocumentMask = (documentType) => {
  return documentType === 'cpf' ? '999.999.999-99' : '99.999.999/9999-99';
};

/**
 * Retorna o placeholder correspondente ao tipo de documento
 * Mantida apenas como referência, não utilizada no componente atual
 * @param {string} documentType - Tipo de documento ('cpf' ou 'cnpj')
 * @returns {string} Placeholder para o tipo de documento
 */
export const getDocumentPlaceholder = (documentType) => {
  return documentType === 'cpf' ? 'Digite seu CPF' : 'Digite o CNPJ';
};

/**
 * Valida um documento com base no tipo
 * @param {string} document - Documento a ser validado
 * @param {string} documentType - Tipo de documento ('cpf' ou 'cnpj')
 * @returns {boolean} true se o documento for válido, false caso contrário
 */
export const validateDocument = (document, documentType) => {
  if (!document) return false;
  
  return documentType === 'cpf' 
    ? validateCPF(document) 
    : validateCNPJ(document);
};
