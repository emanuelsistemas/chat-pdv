# Componentes para Manipulação de Documentos (CNPJ/CPF)

## Visão Geral
O ChatFood implementa uma solução completa para manipulação de documentos brasileiros (CNPJ e CPF), incluindo componentes para entrada de dados com máscara, validação, e um seletor interativo que permite alternar entre os tipos de documento.

## Componentes Disponíveis

### MaskedInput
Um componente reutilizável para entrada de texto com máscara, baseado na biblioteca `react-imask`. Pode ser usado para diversos formatos como CPF, CNPJ, telefone, CEP, etc.

### DocumentSelector
Um componente especializado que combina:
- Toggle para seleção entre CNPJ e CPF.
- Campo formatado para entrada do documento escolhido.
- Validação em tempo real do documento.
- Ícone de busca opcional para CNPJ.

### PhoneInput
Um componente especializado para entrada de números de telefone com formatação `(99) 9 9999-9999`, ideal para WhatsApp e outros números de celular brasileiros.

### PasswordInput
Um componente para entrada de senha com funcionalidade de mostrar/ocultar a senha ao clicar no ícone de olho.

## Utilitários de Validação
O sistema inclui funções utilitárias para validação e formatação de documentos:

- `validateCPF`: Verifica se um CPF é válido (incluindo dígitos verificadores)
- `validateCNPJ`: Verifica se um CNPJ é válido (incluindo dígitos verificadores)
- `formatCPF`: Formata um CPF com pontos e traço (000.000.000-00)
- `formatCNPJ`: Formata um CNPJ com pontos, barra e traço (00.000.000/0000-00)
- `getDocumentMask`: Retorna a máscara apropriada para cada tipo de documento
- `removeNonDigits`: Remove caracteres não numéricos de uma string

## Exemplo de Uso

### MaskedInput
```jsx
import { MaskedInput } from '../components/form';

// Para CPF
<MaskedInput
  id="cpf"
  name="cpf"
  value={cpf}
  onChange={handleChange}
  mask="999.999.999-99"
/>

// Para telefone
<MaskedInput
  id="telefone"
  name="telefone"
  value={telefone}
  onChange={handleChange}
  mask="+55 (99) 99999-9999"
/>
```

### DocumentSelector
```jsx
import { DocumentSelector } from '../components/form';

<DocumentSelector
  value={documento}
  onChange={handleChange}
  defaultDocumentType="cnpj" // ou "cpf"
  showValidation={true}
  enableSearch={true}
  onSearchClick={(doc) => {
    // Fazer algo com o documento, como buscar dados em uma API
    console.log(`Buscar informações: ${doc}`);
  }}
/>
```

### PhoneInput
```jsx
import { PhoneInput } from '../components/form';

<PhoneInput
  id="whatsapp"
  name="whatsapp"
  label="WhatsApp"
  value={telefone}
  onChange={handleChange}
/>
```

### PasswordInput
```jsx
import { PasswordInput } from '../components/form';

<PasswordInput
  id="senha"
  name="senha"
  label="Senha"
  value={senha}
  onChange={handleChange}
/>
```

### Funções de Validação
```javascript
import { validateCPF, validateCNPJ } from '../utils/documentValidation';

// Validando um CPF
const cpfValido = validateCPF('123.456.789-00');

// Validando um CNPJ
const cnpjValido = validateCNPJ('12.345.678/0001-90');
```

## Limitações Conhecidas
- A máscara não impede a entrada de caracteres inválidos, apenas os formata
- A validação é feita apenas no front-end, sendo necessária validação adicional no back-end
- A busca por CNPJ requer integração com uma API externa (não incluída)

## Dependências Externas
- `react-imask`: Biblioteca utilizada para implementar máscaras de entrada. Compatível com as versões mais recentes do React.

## Manutenção
Para manter ou estender os componentes de documento:

1. **Novas Máscaras**: Para adicionar novas máscaras, use o componente `MaskedInput` com o formato desejado
2. **Personalização do Visual**: Os componentes usam Tailwind CSS e podem ser personalizados
3. **Integração com APIs**: A funcionalidade de busca pode ser integrada com APIs como a da Receita Federal
4. **Validação Adicional**: Para requisitos específicos, estenda as funções de validação no arquivo `documentValidation.js`
