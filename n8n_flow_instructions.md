# Instruções para o Fluxo do n8n

## Problemas Resolvidos

### 1. Violação de Chave Estrangeira

O primeiro problema que estava ocorrendo era uma violação de chave estrangeira na tabela `cadastro_empresas_sistema`. A tabela tinha uma restrição que exigia que o campo `id` existisse na tabela `auth.users` do Supabase antes de inserir um registro.

Solução implementada:
1. Removemos a restrição de chave estrangeira `cadastro_empresas_sistema_id_fkey`
2. Adicionamos uma coluna `user_id` que pode ser nula
3. Criamos uma nova restrição opcional `fk_auth_users_optional` que permite inserir registros sem um usuário correspondente

### 2. Violação de Restrição Not-Null no Campo ID

O segundo problema era que o campo `id` da tabela `cadastro_empresas_sistema` não podia ser nulo, mas não estava sendo fornecido automaticamente.

Solução implementada:
1. Configuramos o campo `id` para usar um valor padrão gerado automaticamente com a função `gen_random_uuid()`
2. Instalamos a extensão `pgcrypto` no PostgreSQL para suportar a função `gen_random_uuid()`

## Configuração do Fluxo no n8n

Para inserir registros na tabela `cadastro_empresas_sistema` através do n8n, siga estas instruções:

### 1. Nó de Webhook

Configure um nó de webhook para receber os dados do formulário de cadastro.

### 2. Nó de Função JavaScript

Use um nó de função JavaScript para formatar os dados recebidos. Certifique-se de incluir os campos obrigatórios:

```javascript
// Formatar os dados recebidos
return {
  json: {
    // Não é necessário fornecer o campo id, será gerado automaticamente pelo PostgreSQL
    
    // CAMPOS OBRIGATÓRIOS - DEVEM SER FORNECIDOS
    nome: $input.item.json.nome, // OBRIGATÓRIO
    email: $input.item.json.email, // OBRIGATÓRIO
    
    // CAMPOS OPCIONAIS
    documento: $input.item.json.documento ? $input.item.json.documento.replace(/[^\d]/g, '') : null, // Remover formatação
    documento_tipo: $input.item.json.documento_tipo || 'cnpj',
    razaosocial: $input.item.json.razao_social || null,
    nomefantasia: $input.item.json.nome_fantasia || $input.item.json.nome,
    whatsapp: $input.item.json.whatsapp ? $input.item.json.whatsapp.replace(/[^\d]/g, '') : null,
    
    // Campos com valores padrão
    // created_at e updated_at serão preenchidos automaticamente pelo PostgreSQL se não fornecidos
    created_at: new Date().toISOString(),
    
    // Campo opcional para vínculo com usuário do Supabase
    user_id: null
  }
}
```

**IMPORTANTE**: Verifique se os campos `nome` e `email` estão sendo recebidos do formulário e não são nulos ou vazios. Esses campos são obrigatórios e causarão erro se não forem fornecidos.

### 3. Nó PostgreSQL

Configure um nó PostgreSQL com as seguintes configurações:

- **Operação**: Insert
- **Tabela**: cadastro_empresas_sistema
- **Colunas**: Mapeie os campos conforme o exemplo abaixo. Observe que o campo `id` NÃO PRECISA ser incluído, pois será gerado automaticamente pelo PostgreSQL.

```
{
  // CAMPOS OBRIGATÓRIOS
  "nome": "{{$node["Função"].json.nome}}", // OBRIGATÓRIO
  "email": "{{$node["Função"].json.email}}", // OBRIGATÓRIO
  
  // CAMPOS OPCIONAIS
  "documento": "{{$node["Função"].json.documento}}",
  "documento_tipo": "{{$node["Função"].json.documento_tipo}}",
  "razaosocial": "{{$node["Função"].json.razaosocial}}",
  "nomefantasia": "{{$node["Função"].json.nomefantasia}}",
  "whatsapp": "{{$node["Função"].json.whatsapp}}",
  
  // Campos com valores padrão
  "created_at": "{{$node["Função"].json.created_at}}",
  
  // Campo opcional para vínculo com usuário do Supabase
  "user_id": null
}
```

**Verificação importante**: No nó PostgreSQL, certifique-se de que:
1. Os campos obrigatórios `nome` e `email` estão sendo fornecidos e não são nulos
2. O campo `id` NÃO está sendo incluído, para que o PostgreSQL possa gerar automaticamente
3. Verifique se os dados estão sendo mapeados corretamente do nó de Função JavaScript

### 4. Nó de Resposta do Webhook

Configure um nó de resposta do webhook para retornar uma mensagem de sucesso:

```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso!",
  "redirect": true,
  "redirectUrl": "/login"
}
```

## Exemplo de Fluxo Completo

1. Webhook recebe dados do formulário
2. Função JavaScript formata os dados
3. PostgreSQL insere os dados na tabela
4. Resposta do Webhook retorna mensagem de sucesso

## Campos da Tabela

Aqui está um resumo dos campos da tabela `cadastro_empresas_sistema`:

| Campo | Tipo | Obrigatório | Valor Padrão |
|-------|------|-------------|--------------|
| id | uuid | SIM | gen_random_uuid() |
| nome | text | SIM | Nenhum |
| email | text | SIM | Nenhum |
| documento | text | NÃO | Nenhum |
| documento_tipo | text | NÃO | Nenhum |
| razaosocial | text | NÃO | Nenhum |
| nomefantasia | text | NÃO | Nenhum |
| whatsapp | text | NÃO | Nenhum |
| created_at | timestamp | NÃO | now() |
| updated_at | timestamp | NÃO | now() |
| user_id | uuid | NÃO | Nenhum |

## Observações Importantes

- Não é mais necessário criar um usuário no Supabase antes de inserir na tabela `cadastro_empresas_sistema`
- O campo `id` será gerado automaticamente pelo PostgreSQL, você NÃO PRECISA fornecê-lo
- Os campos `nome` e `email` são OBRIGATÓRIOS e devem ser fornecidos
- Se desejar vincular o registro a um usuário do Supabase posteriormente, você pode atualizar o campo `user_id`
- Os campos `created_at` e `updated_at` têm valores padrão, mas é uma boa prática fornecê-los explicitamente

## Teste do Fluxo

Para testar o fluxo, envie uma requisição POST para o webhook com os seguintes dados:

```json
{
  "nome": "Usuário Teste",
  "email": "teste@exemplo.com",
  "documento": "12.345.678/0001-90",
  "documento_tipo": "cnpj",
  "razao_social": "Razão Social Teste",
  "nome_fantasia": "Nome Fantasia Teste",
  "whatsapp": "(11) 99999-9999",
  "senha": "senha123"
}
```

O fluxo deve processar esses dados e inserir um registro na tabela `cadastro_empresas_sistema` sem erros.
