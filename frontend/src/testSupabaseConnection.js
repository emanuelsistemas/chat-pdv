import supabase from './utils/supabaseClient';

// Função para testar conexão com o Supabase
async function testConnection() {
  console.log('Testando conexão com o Supabase...');
  
  try {
    // Verifica a conexão tentando fazer uma consulta simples
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    
    if (error && error.code === 'PGRST301') {
      // Este erro é esperado se a tabela não existir, mas indica que a conexão está ok
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      console.log('Detalhes do erro (esperado): ', error.message);
      return true;
    } else if (error) {
      console.error('❌ Erro ao conectar com o Supabase:', error.message);
      return false;
    } else {
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      console.log('Dados recebidos:', data);
      return true;
    }
  } catch (error) {
    console.error('❌ Exceção ao conectar com o Supabase:', error.message);
    return false;
  }
}

// Executa o teste
testConnection().then(isConnected => {
  console.log(`Resultado do teste: ${isConnected ? 'Conectado' : 'Falha na conexão'}`);
  
  // Verifica a configuração
  console.log('\nConfigurações:');
  console.log('URL do Supabase:', supabase.supabaseUrl);
  console.log('Chave pública:', supabase.supabaseKey ? 'Definida' : 'Não definida');
});
