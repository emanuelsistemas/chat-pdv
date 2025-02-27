-- Criação do esquema public se não existir
CREATE SCHEMA IF NOT EXISTS public;

-- Criação da tabela cadastro_empresas_sistema
CREATE TABLE IF NOT EXISTS public.cadastro_empresas_sistema (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  documento TEXT,
  documento_tipo TEXT,
  tipoEmpresa TEXT,
  razaoSocial TEXT,
  nomeFantasia TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Política para verificar unicidade de documento
CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_documento_unique 
ON public.cadastro_empresas_sistema (documento)
WHERE documento IS NOT NULL;

-- Criação da tabela de autenticação para simular o Supabase Auth
CREATE TABLE IF NOT EXISTS public.auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Seria hash da senha em produção
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionando chave estrangeira após ambas as tabelas existirem
ALTER TABLE public.cadastro_empresas_sistema
ADD CONSTRAINT fk_auth_users
FOREIGN KEY (id) REFERENCES public.auth_users(id)
ON DELETE CASCADE;
