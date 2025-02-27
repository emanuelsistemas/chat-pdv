# Toast Notifications System

## Visão Geral
O sistema de notificações Toast é uma solução moderna e reutilizável para exibir feedback ao usuário após ações como inserções, deleções, alterações ou erros. As notificações são exibidas temporariamente no canto superior direito da tela e desaparecem automaticamente após um tempo determinado.

## Implementação Técnica

### Componentes
1. **Toast.jsx**: Componente individual de toast que exibe uma única notificação
2. **ToastContainer.jsx**: Gerencia a exibição de múltiplos toasts
3. **ToastContext.jsx**: Contexto React que permite usar o sistema de toasts de qualquer lugar da aplicação

### Fluxo de Dados
1. O provedor de contexto `ToastProvider` é inserido no topo da aplicação
2. Componentes podem acessar as funções de toast usando o hook `useToast()`
3. Quando um toast é adicionado, ele é exibido por um período determinado e depois removido automaticamente

## Uso

### Funções Disponíveis
- **showSuccess(message, duration)**: Exibe um toast de sucesso
- **showError(message, duration)**: Exibe um toast de erro
- **showWarning(message, duration)**: Exibe um toast de aviso
- **showInfo(message, duration)**: Exibe um toast informativo
- **addToast(message, type, duration)**: Função genérica para adicionar um toast

### Exemplos de Uso

#### Exemplo Básico

```jsx
import { useToast } from '../contexts/ToastContext';

function MeuComponente() {
  const { showSuccess, showError } = useToast();
  
  const handleSalvar = async () => {
    try {
      await salvarDados();
      showSuccess('Dados salvos com sucesso!');
    } catch (error) {
      showError('Erro ao salvar dados: ' + error.message);
    }
  };
  
  return (
    <button onClick={handleSalvar}>Salvar</button>
  );
}
```

#### Exemplo no Componente de Cadastro

```jsx
// Em Cadastro.jsx
import { useToast } from './contexts/ToastContext';

function Cadastro() {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      // Verificar se o CNPJ já existe
      const cnpjExists = await checkCNPJExists(formData.documento);
      if (cnpjExists) {
        showError('CNPJ já cadastrado no sistema');
        return;
      }
      
      // Código para registrar usuário...
      await authService.register(/*...*/);
      
      showSuccess('Cadastro realizado com sucesso!');
      // Redirecionamento...
    } catch (error) {
      showError(`Erro no cadastro: ${error.message}`);
    }
  };
  
  return (
    // JSX do formulário...
  );
}
```

#### Exemplo no Componente de Login

```jsx
// Em Login.jsx
import { useToast } from './contexts/ToastContext';

function Login() {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha) {
      showError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      const { error } = await authService.login(formData.email, formData.senha);
      
      if (error) {
        throw new Error(error.message);
      }
      
      showSuccess('Login realizado com sucesso!');
      // Redirecionamento...
    } catch (error) {
      showError(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : `Erro no login: ${error.message}`);
    }
  };
}
```

## Personalização

### Tipos de Toast
- **success**: Verde, para operações bem-sucedidas
- **error**: Vermelho, para erros e falhas
- **warning**: Amarelo, para avisos e atenção
- **info**: Azul, para informações gerais

### Duração
É possível personalizar a duração de cada toast em milissegundos (padrão: 3000ms)

## Acessibilidade
- Ícones específicos para cada tipo de toast
- Contraste de cores adequado
- Suporte ao tema escuro
- Possibilidade de fechar manualmente o toast
- Rótulos ARIA para leitores de tela

## Limitações Conhecidas
- Limite recomendado de 5 toasts simultâneos para evitar sobrecarga visual
- Em telas muito pequenas, os toasts podem ocupar uma porcentagem maior da tela

## Processo de Manutenção
Para expandir ou modificar o sistema de toasts:

1. Componentes visuais: editar `Toast.jsx` ou `ToastContainer.jsx`
2. Lógica de estado: editar `ToastContext.jsx`
3. Temas e estilos: editar as classes no componente `Toast.jsx`
