// Script para testar a conexão com o Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Iniciando teste de conexão com o Supabase...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Chave anônima definida: ${supabaseAnonKey ? 'Sim' : 'Não'}`);

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não estão definidas.');
  console.error('Verifique o arquivo .env ou a configuração das variáveis de ambiente.');
  process.exit(1);
}

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
async function testConnection() {
  try {
    // Tenta fazer uma consulta simples para verificar a conexão
    console.log('Testando conexão...');
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    
    if (error && error.code === 'PGRST301') {
      // Este erro é esperado se a tabela não existir, mas indica que a conexão está ok
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      console.log('Detalhes do erro (esperado): ', error.message);
      return true;
    } else if (error) {
      console.error('❌ Erro ao conectar com o Supabase:');
      console.error(error);
      return false;
    } else {
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      console.log('Dados recebidos:', data);
      return true;
    }
  } catch (error) {
    console.error('❌ Exceção ao conectar com o Supabase:');
    console.error(error);
    return false;
  }
}

// Executa o teste
testConnection()
  .then(isConnected => {
    console.log(`\nResultado final do teste: ${isConnected ? 'CONECTADO ✅' : 'FALHA NA CONEXÃO ❌'}`);
    process.exit(isConnected ? 0 : 1);
  })
  .catch(error => {
    console.error('Erro não tratado durante o teste:');
    console.error(error);
    process.exit(1);
  });
