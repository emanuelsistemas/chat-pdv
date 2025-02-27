# Componente SearchableDropdown

## Visão Geral
O `SearchableDropdown` é um componente React reutilizável que implementa uma caixa de seleção com funcionalidade de pesquisa integrada. Ele permite que os usuários selecionem um item de uma lista potencialmente longa, com a possibilidade de filtrar as opções através de uma busca em tempo real.

## Implementação Técnica

### Props
O componente aceita as seguintes propriedades:

| Prop | Tipo | Descrição | Padrão |
|------|------|-----------|--------|
| `label` | string | Texto exibido quando nenhum item está selecionado | "Selecione uma opção" |
| `value` | string | Valor atualmente selecionado | "" |
| `options` | Array | Lista de opções disponíveis para seleção | [] |
| `onChange` | Function | Função chamada quando um item é selecionado | obrigatório |
| `searchPlaceholder` | string | Texto de placeholder para o campo de busca | "Buscar..." |
| `noResultsText` | string | Texto exibido quando nenhum resultado é encontrado | "Nenhum resultado encontrado" |
| `className` | string | Classes CSS adicionais para o componente | "" |

### Estados Internos
- `dropdownOpen`: Controla se o dropdown está aberto ou fechado
- `searchTerm`: Armazena o texto de busca digitado pelo usuário

### Fluxo de Dados
1. O usuário clica no componente para abrir o dropdown
2. Ao digitar no campo de busca, o componente filtra as opções em tempo real
3. Ao selecionar uma opção, o dropdown é fechado e a função `onChange` é chamada com o valor selecionado
4. O dropdown fecha automaticamente quando o usuário clica fora dele

## Exemplo de Uso

```jsx
import { SearchableDropdown } from '../../components/form';

function ExemploFormulario() {
  const [valorSelecionado, setValorSelecionado] = useState('');
  const opcoesDisponiveis = ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4', 'Opção 5'];

  return (
    <div>
      <SearchableDropdown
        label="Selecione uma opção"
        value={valorSelecionado}
        options={opcoesDisponiveis}
        onChange={setValorSelecionado}
        searchPlaceholder="Pesquisar opções..."
        noResultsText="Nenhuma opção encontrada"
      />
    </div>
  );
}
```

## Limitações Conhecidas
- Atualmente suporta apenas strings simples como opções
- Não permite a seleção de múltiplos valores
- A altura máxima do dropdown é fixa em 60 unidades de altura

## Manutenção
Para manter este componente, considere os seguintes aspectos:

1. **Atualizando o estilo**: A estilização do componente usa Tailwind CSS e segue o padrão de design do sistema
2. **Expansão de funcionalidades**: Se precisar de múltiplas seleções, considere adicionar um prop `multiple` e adaptar o comportamento
3. **Acessibilidade**: Considere melhorar com suporte para navegação por teclado e atributos ARIA
