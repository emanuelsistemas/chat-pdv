# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2025-02-27

### Adicionado
- Campo `data_criacao` adicionado ao payload enviado ao webhook n8n para registrar o momento do cadastro
- Remoção do campo `tipoEmpresa` do payload enviado ao webhook n8n


## [0.1.2] - 2025-02-27

### Modificado
- Remoção de formatação (pontos, traços e barras) dos números de documentos (CPF/CNPJ) antes do envio ao webhook
- Implementada função auxiliar `removerFormatacao` para processar apenas números nos documentos


## [0.1.1] - 2025-02-27

### Corrigido
- Alinhamento dos labels nos campos do formulário de cadastro
- Labels agora permanecem alinhados à esquerda quando o campo recebe foco


## [0.1.0] - 2025-02-27

### Adicionado
- Integração com webhooks n8n para processamento de cadastros
- Configuração de URLs diferentes para ambientes de desenvolvimento e produção
- Documentação detalhada sobre o uso de webhooks n8n no projeto
- Sistema de versionamento semântico e padronização de commits

### Modificado
- Componente de cadastro para utilizar os webhooks do n8n
- Remoção da validação de CNPJ no frontend (agora feita pelo n8n)

### Corrigido
- Comportamento inconsistente de URLs entre ambientes de desenvolvimento e produção