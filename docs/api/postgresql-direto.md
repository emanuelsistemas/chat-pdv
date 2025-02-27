# Conexão direta com PostgreSQL

## Visão Geral

Este documento descreve a implementação da conexão direta com o PostgreSQL para gerenciamento de usuários e perfis no sistema ChatFood.

## Implementação Técnica

### Backend (Express + PostgreSQL)

O backend utiliza as seguintes tecnologias:
- **Express.js**: Framework para criação de APIs RESTful
- **pg (node-postgres)**: Cliente PostgreSQL para Node.js
- **bcrypt**: Biblioteca para hashear senhas
- **uuid**: Gerador de IDs únicos

### Estrutura do Banco de Dados

O sistema utiliza a seguinte tabela principal:

```sql
CREATE TABLE IF NOT EXISTS public.cadastro_empresas_sistema (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  documento TEXT,
  documento_tipo TEXT,
  tipo_empresa TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  whatsapp TEXT,
  senha_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_email_unique 
ON public.cadastro_empresas_sistema (email);

CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_documento_unique 
ON public.cadastro_empresas_sistema (documento) 
WHERE documento IS NOT NULL;
```

### APIs Disponíveis

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/health` | GET | Verificar conexão com o banco de dados |
| `/api/check-cnpj/:cnpj` | GET | Verificar se um CNPJ já existe |
| `/api/register` | POST | Registrar um novo usuário |
| `/api/login` | POST | Fazer login |
| `/api/profile/:id` | GET | Obter perfil do usuário |

## Fluxo de Dados

### Registro de Usuário

1. O frontend coleta os dados do usuário no formulário de cadastro
2. Verifica-se se o CNPJ já existe através da API `/api/check-cnpj/:cnpj`
3. Os dados são enviados para a API `/api/register`
4. O backend valida os dados, hasheia a senha e salva no banco de dados
5. Retorna ID e informações básicas do usuário criado

### Login

1. O frontend envia email e senha para API `/api/login`
2. O backend verifica as credenciais no banco
3. Em caso de sucesso, retorna um identificador de sessão e dados do usuário
4. O frontend armazena essas informações no localStorage

## Configuração Necessária

### Variáveis de Ambiente

**Backend**
```
PORT=3000
POSTGRES_USER=postgres
POSTGRES_HOST=192.168.128.4
POSTGRES_DB=postgres
POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
POSTGRES_PORT=5432
```

**Frontend**
```
VITE_API_BASE_URL=http://localhost:3000
```

## Limitações Conhecidas

1. A implementação atual utiliza uma sessão simples sem JWT
2. Não há renovação automática de sessão
3. Senha armazenada em hash, mas sem salt individual por usuário

## Processo de Manutenção

### Atualizações no Banco de Dados

Para adicionar novos campos à tabela, siga o processo:

1. Pare o servidor
2. Adicione o campo à função `initializeDatabase` no arquivo `server.js`
3. Inicie o servidor
4. Atualize as chamadas de API afetadas

### Backup do Banco de Dados

Recomenda-se fazer backup periódico do banco:

```bash
docker exec -i chat-food_supabase-db-1 pg_dump -U postgres postgres > backup.sql
```
