// Script para testar a conexão com o Supabase depois de criar a tabela
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testando conexão com a tabela cadastro_empresas_sistema...');
console.log(`URL: ${supabaseUrl}`);

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não estão definidas.');
  console.error('Verifique o arquivo .env ou a configuração das variáveis de ambiente.');
  process.exit(1);
}

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar se a tabela existe e fazer uma consulta
async function testTableAccess() {
  try {
    console.log('Tentando consultar a tabela cadastro_empresas_sistema...');
    
    const { data, error } = await supabase
      .from('cadastro_empresas_sistema')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Erro ao acessar a tabela:', error.message);
      return false;
    } else {
      console.log('✅ Tabela acessada com sucesso!');
      console.log(`Registros encontrados: ${data.length}`);
      if (data.length > 0) {
        console.log('Exemplo de registro:');
        console.log(data[0]);
      } else {
        console.log('A tabela está vazia.');
      }
      return true;
    }
  } catch (error) {
    console.error('❌ Exceção ao acessar a tabela:', error.message);
    return false;
  }
}

// Executa o teste
testTableAccess()
  .then(success => {
    console.log(`\nResultado do teste: ${success ? 'SUCESSO ✅' : 'FALHA ❌'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Erro não tratado:', error);
    process.exit(1);
  });
