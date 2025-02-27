# Implementação de Webhooks N8n

## Visão Geral

O Chat-Food utiliza o n8n como ferramenta de automação para processar fluxos de trabalho, como o cadastro de usuários. Para isso, utilizamos webhooks que permitem a comunicação entre o frontend e o n8n.

## Configuração de Ambientes

É fundamental configurar sempre dois webhooks distintos para cada fluxo:

1. **Webhook de Desenvolvimento**: Utilizado durante o desenvolvimento e testes locais.
2. **Webhook de Produção**: Utilizado no ambiente de produção.

## Estrutura de Configuração

No arquivo `frontend/src/config/apiUrls.js`, mantemos as URLs organizadas por ambiente:

```javascript
const apiUrls = {
  development: {
    cadastroWebhook: 'https://chat-food-n8n.punzm2.easypanel.host/webhook-test/b8ba7a23-e130-4abb-9e4e-9c24d3407c10',
    // Adicionar novos webhooks de desenvolvimento aqui
  },
  production: {
    cadastroWebhook: 'https://chat-food-n8n.punzm2.easypanel.host/webhook/b8ba7a23-e130-4abb-9e4e-9c24d3407c10',
    // Adicionar novos webhooks de produção aqui
  },
};
```

## Uso nos Componentes

Para utilizar os webhooks nos componentes React, utilizamos a verificação do ambiente para selecionar a URL correta:

```javascript
// Exemplo do arquivo frontend/src/Cadastro.jsx
const apiUrl = process.env.NODE_ENV === 'production' 
  ? apiUrls.production.cadastroWebhook 
  : apiUrls.development.cadastroWebhook;

const response = await axios.post(apiUrl, data);
```

## Lista de Webhooks

| Nome | Descrição | URL Desenvolvimento | URL Produção |
|------|-----------|---------------------|--------------|
| cadastroWebhook | Processa o cadastro de novos usuários | /webhook-test/b8ba7a23-e130-4abb-9e4e-9c24d3407c10 | /webhook/b8ba7a23-e130-4abb-9e4e-9c24d3407c10 |

## Adicionando Novos Webhooks

Ao adicionar um novo webhook ao sistema:

1. Crie o fluxo no n8n e gere dois webhooks (um para teste e um para produção)
2. Adicione as URLs no arquivo `apiUrls.js` nas seções apropriadas
3. No componente, use a verificação de ambiente para selecionar a URL correta
4. Documente o novo webhook neste arquivo

## Boas Práticas

- **Nunca hardcode URLs de webhook** diretamente nos componentes
- **Sempre crie dois endpoints** para cada funcionalidade (desenvolvimento e produção)
- **Documente novos webhooks** neste arquivo de referência
- **Teste ambos os ambientes** antes de fazer deploy para produção