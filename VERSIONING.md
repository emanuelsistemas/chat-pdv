# Política de Versionamento do Chat-Food

Este documento define as diretrizes para o versionamento do projeto Chat-Food, seguindo o padrão Semantic Versioning (SemVer).

## Formato do Versionamento

Todas as versões seguirão o formato: **MAJOR.MINOR.PATCH**

- **MAJOR**: Incrementado quando há mudanças incompatíveis com versões anteriores
- **MINOR**: Incrementado quando há adição de funcionalidades mantendo compatibilidade
- **PATCH**: Incrementado quando há correções de bugs mantendo compatibilidade

## Tags de Commit

Ao fazer commits, utilize prefixos que indiquem o tipo de alteração:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações de formatação que não afetam o código
- `refactor`: Refatoração de código sem alteração de comportamento
- `perf`: Melhorias de performance
- `test`: Adição ou correção de testes
- `chore`: Atualizações de tarefas de build, configurações, etc.

## Exemplo de Mensagem de Commit

```
feat(cadastro): Implementação de webhook n8n para cadastro v0.1.0
```

## Criação de Tags Git

Após cada mudança significativa de versão, crie uma tag Git correspondente:

```bash
git tag -a v0.1.0 -m "Versão 0.1.0 - Implementação inicial de webhooks n8n"
git push origin v0.1.0
```

## Versionamento de Componentes

O projeto Chat-Food possui componentes frontend e backend que podem evoluir em ritmos diferentes. Mantenha o controle de versão de forma unificada no repositório principal.

## Estrutura de Branches

- `main`: Código de produção estável
- `developer`: Desenvolvimento e integração
- `feature/*`: Desenvolvimento de funcionalidades específicas
- `bugfix/*`: Correção de bugs específicos
- `release/*`: Preparação para lançamento de versões

## Notas de Versão

Para cada versão lançada, atualize o arquivo CHANGELOG.md com as alterações realizadas.