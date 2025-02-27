-- Script para corrigir o problema de constraint na tabela cadastro_empresas_sistema

-- Primeiro remover a constraint existente que está causando o problema
ALTER TABLE public.cadastro_empresas_sistema
DROP CONSTRAINT IF EXISTS fk_auth_users;

-- Alterar a estrutura da tabela para usar um campo separado para relacionamento
ALTER TABLE public.cadastro_empresas_sistema
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Criar uma nova constraint que permite cadastro independente de usuário
ALTER TABLE public.cadastro_empresas_sistema
ADD CONSTRAINT fk_auth_users
FOREIGN KEY (user_id) REFERENCES public.auth_users(id)
ON DELETE SET NULL;

-- Certificar-se que a coluna id é gerada automaticamente
ALTER TABLE public.cadastro_empresas_sistema
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Comentário sobre o que foi alterado:
-- 1. A tabela cadastro_empresas_sistema agora tem um ID gerado automaticamente
-- 2. Foi adicionado um campo user_id para referenciar a tabela auth_users
-- 3. A chave estrangeira agora é opcional, permitindo cadastro sem usuário
-- 4. O relacionamento agora é mais flexível, seguindo o padrão de user_id