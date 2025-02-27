-- Script para reestruturar o banco de dados com tabelas relacionadas corretamente

-- Excluir constraints existentes para permitir a reestruturação
ALTER TABLE IF EXISTS public.cadastro_empresas_sistema
DROP CONSTRAINT IF EXISTS fk_auth_users;

-- Certificar-se que os schemas existem
CREATE SCHEMA IF NOT EXISTS public;

-- Recriar a tabela de empresas com estrutura otimizada
DROP TABLE IF EXISTS public.cadastro_empresas_sistema CASCADE;
CREATE TABLE public.cadastro_empresas_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT,
  documento TEXT NOT NULL, -- CNPJ da empresa
  documento_tipo TEXT DEFAULT 'cnpj',
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice único para CNPJ
CREATE UNIQUE INDEX cadastro_empresas_sistema_documento_unique 
ON public.cadastro_empresas_sistema (documento)
WHERE documento IS NOT NULL;

-- Recriar tabela de usuários com vínculo à empresa
DROP TABLE IF EXISTS public.auth_users CASCADE;
CREATE TABLE public.auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Seria hash da senha em produção
  empresa_documento TEXT NOT NULL, -- CNPJ para vínculo com a empresa
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_empresa 
    FOREIGN KEY (empresa_documento) 
    REFERENCES public.cadastro_empresas_sistema(documento)
    ON DELETE CASCADE
);

-- Adicionar índice para melhorar performance de consultas por empresa
CREATE INDEX idx_auth_users_empresa ON public.auth_users(empresa_documento);

-- Comentários explicativos:
COMMENT ON TABLE public.cadastro_empresas_sistema IS 'Armazena os dados das empresas cadastradas';
COMMENT ON TABLE public.auth_users IS 'Armazena os usuários vinculados às empresas pelo CNPJ';
COMMENT ON COLUMN public.auth_users.empresa_documento IS 'CNPJ da empresa à qual o usuário pertence';