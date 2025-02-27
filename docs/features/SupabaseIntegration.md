# Integração com Supabase

Este documento descreve como o ChatFood se integra com o Supabase para gerenciamento de dados e autenticação.

## Configuração

### Pré-requisitos

- Conta no [Supabase](https://supabase.com/)
- Projeto criado no Supabase
- Credenciais de acesso (URL, chave anônima e service role secret)

### Configuração de Ambiente

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto frontend:

```bash
cp .env.example .env
```

2. Atualize as variáveis de ambiente no arquivo `.env` com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=sua-url-do-projeto-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
VITE_SUPABASE_SERVICE_ROLE_SECRET=sua-service-role-secret-aqui
```

## Estrutura da Base de Dados

### Tabela: profiles

Estrutura sugerida para a tabela de perfis de usuários:

| Coluna         | Tipo      | Descrição                           |
|----------------|-----------|-------------------------------------|
| id             | uuid      | ID do usuário (chave primária)      |
| nome           | text      | Nome completo do usuário            |
| email          | text      | Email do usuário                    |
| documento      | text      | CPF ou CNPJ do usuário              |
| tipo_documento | text      | Tipo de documento (cpf ou cnpj)     |
| razao_social   | text      | Razão social (apenas para CNPJ)     |
| nome_fantasia  | text      | Nome fantasia (apenas para CNPJ)    |
| whatsapp       | text      | Número de WhatsApp do usuário       |
| created_at     | timestamp | Data de criação do registro         |
| updated_at     | timestamp | Data da última atualização          |

## Uso

### Cliente Supabase

O cliente do Supabase é inicializado em `src/utils/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

### Serviços

O projeto inclui serviços para interagir com o Supabase:

1. **authService**: Gerencia autenticação (registro, login, logout)
2. **userService**: Gerencia dados de perfil de usuário

### Exemplo: Registro de Usuário

```javascript
import authService from '../services/authService';
import userService from '../services/userService';

const registerUser = async (userData) => {
  try {
    // Registra o usuário na autenticação
    const authData = await authService.register(
      userData.email, 
      userData.senha, 
      { nome: userData.nome }
    );
    
    // Cria o perfil do usuário
    if (authData.user) {
      await userService.createProfile({
        id: authData.user.id,
        ...userData
      });
    }
    
    return authData;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};
```

## Limitações Conhecidas

- O serviço de integração atual não inclui funcionalidades de recuperação de senha
- Não inclui integração com provedores de autenticação social (Google, Facebook, etc.)

## Manutenção

### Migração de Esquema

Para adicionar novas colunas ou tabelas, use o SQL Editor do Supabase ou a interface de gerenciamento de tabelas.

### Considerações de Segurança

- Mantenha as chaves de API em variáveis de ambiente
- Nunca exponha a service_role_secret no frontend
- Configure as RLS (Row Level Security) no Supabase para proteger seus dados

### Suporte e Resolução de Problemas

Para problemas relacionados ao Supabase, consulte:
- [Documentação oficial do Supabase](https://supabase.com/docs)
- [Fórum da comunidade Supabase](https://github.com/supabase/supabase/discussions)
