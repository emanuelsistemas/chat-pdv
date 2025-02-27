import { createClient } from '@supabase/supabase-js';

// Você pode executar este script usando node para criar as tabelas necessárias
// Certifique-se de que as variáveis de ambiente estão configuradas corretamente

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_SECRET;

// Inicializa o cliente Supabase com a chave de serviço para ter permissões admin
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');
    
    // Verifica se a tabela cadastro_empresas_sistema já existe
    const { error: checkError } = await supabase
      .from('cadastro_empresas_sistema')
      .select('id')
      .limit(1);
    
    // Se não houver erro, a tabela já existe
    if (!checkError) {
      console.log('A tabela cadastro_empresas_sistema já existe. Pulando criação.');
      return;
    }
    
    // Cria a tabela cadastro_empresas_sistema se ela não existir
    if (checkError.message.includes('relation "public.cadastro_empresas_sistema" does not exist')) {
      console.log('Criando tabela cadastro_empresas_sistema...');
      
      // SQL para criar a tabela cadastro_empresas_sistema
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE public.cadastro_empresas_sistema (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
          
          -- Configurar políticas RLS (Row Level Security)
          ALTER TABLE public.cadastro_empresas_sistema ENABLE ROW LEVEL SECURITY;
          
          -- Políticas para usuários autenticados
          CREATE POLICY "Usuários podem ver seus próprios cadastros"
            ON public.cadastro_empresas_sistema
            FOR SELECT
            USING (auth.uid() = id);
            
          CREATE POLICY "Usuários podem atualizar seus próprios cadastros"
            ON public.cadastro_empresas_sistema
            FOR UPDATE
            USING (auth.uid() = id);
            
          -- Política para permitir inserções pelo serviço
          CREATE POLICY "Permitir novas inserções"
            ON public.cadastro_empresas_sistema
            FOR INSERT
            WITH CHECK (true);
            
          -- Política para verificar unicidade de documento
          CREATE UNIQUE INDEX cadastro_empresas_sistema_documento_unique ON public.cadastro_empresas_sistema (documento)
            WHERE documento IS NOT NULL;
        `
      });
      
      if (createError) {
        console.error('Erro ao criar tabela cadastro_empresas_sistema:', createError);
      } else {
        console.log('Tabela cadastro_empresas_sistema criada com sucesso.');
      }
    } else {
      console.error('Erro ao verificar tabela cadastro_empresas_sistema:', checkError);
    }
    
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  }
}

// Executa a configuração
setupDatabase()
  .then(() => console.log('Configuração concluída.'))
  .catch(err => console.error('Falha na configuração:', err));
