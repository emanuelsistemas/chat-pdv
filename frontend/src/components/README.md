# Componentes Reutilizáveis do ChatFood

Esta pasta contém todos os componentes reutilizáveis do projeto ChatFood, organizados por categoria.

## Estrutura de Pastas

```
components/
├── ui/             # Componentes de interface de usuário gerais
│   ├── Logo.jsx    # Logo do ChatFood 
│   ├── Toast.jsx   # Sistema de notificações
│   └── index.js    # Exportações dos componentes UI
│
├── form/           # Componentes relacionados a formulários
│   ├── SearchableDropdown.jsx  # Dropdown com pesquisa
│   └── index.js    # Exportações dos componentes de formulário
│
└── layout/         # Componentes de layout e estrutura
    └── index.js    # Exportações dos componentes de layout
```

## Como Usar

Você pode importar componentes individualmente:

```jsx
import Logo from './components/ui/Logo';
import Toast from './components/ui/Toast';
import SearchableDropdown from './components/form/SearchableDropdown';
```

Ou através dos arquivos index:

```jsx
import { Logo, Toast } from './components/ui';
import { SearchableDropdown } from './components/form';
```

## Diretrizes para Adicionar Novos Componentes

1. Identifique a categoria apropriada para o componente
2. Crie o componente na pasta correspondente
3. Adicione a exportação no arquivo index.js da pasta
4. Documente o componente em `/docs/features/`
5. Mantenha os componentes independentes e reutilizáveis
6. Use props para personalização
7. Implemente temas claro/escuro em todos os componentes

## Principais Componentes

### UI
- **Logo**: Logo da aplicação
- **Toast**: Sistema moderno de notificações para feedback ao usuário (sucesso, erro, avisos)

### Form
- **SearchableDropdown**: Dropdown com pesquisa

### Notificações (Toast)

O sistema de Toast fornece uma maneira moderna e elegante de exibir feedback ao usuário. Para usá-lo:

```jsx
import { useToast } from '../contexts/ToastContext';

function MeuComponente() {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async () => {
    try {
      // Código para salvar dados
      showSuccess('Operação realizada com sucesso!');
    } catch (error) {
      showError('Erro: ' + error.message);
    }
  };
}
```

Para mais detalhes, consulte a [documentação completa do Toast](/docs/features/ToastNotifications.md).
