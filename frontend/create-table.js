// Script para criar a tabela no Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Iniciando criação da tabela no Supabase...');
console.log(`URL: ${supabaseUrl}`);

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não estão definidas.');
  console.error('Verifique o arquivo .env ou a configuração das variáveis de ambiente.');
  process.exit(1);
}

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar se a tabela existe
async function checkTableExists() {
  try {
    // Tenta fazer uma consulta simples para verificar se a tabela existe
    const { data, error } = await supabase
      .from('cadastro_empresas_sistema')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST301') {
      console.log('A tabela cadastro_empresas_sistema não existe.');
      return false;
    } else if (error) {
      console.error('Erro ao verificar a tabela:', error.message);
      return false;
    } else {
      console.log('A tabela cadastro_empresas_sistema já existe.');
      return true;
    }
  } catch (error) {
    console.error('Exceção ao verificar a tabela:', error.message);
    return false;
  }
}

// Executa a verificação
checkTableExists()
  .then(tableExists => {
    console.log(`\nA tabela ${tableExists ? 'EXISTE ✅' : 'NÃO EXISTE ❌'}`);
    console.log(`\nPara criar a tabela, você precisa executar a seguinte SQL no painel do Supabase:`);
    console.log(`
-- Criação da tabela cadastro_empresas_sistema
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

-- Política para verificar unicidade de documento
CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_documento_unique 
ON public.cadastro_empresas_sistema (documento)
WHERE documento IS NOT NULL;
    `);
    
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro não tratado:', error);
    process.exit(1);
  });
