// Script para testar a inserção de dados usando o Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/root/chat-food/frontend/.env' });

// Configuração do cliente Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseInsert() {
  try {
    console.log('Testando inserção de dados usando o Supabase...');
    
    // Dados para inserção
    const data = {
      // IMPORTANTE: Incluir o campo nome (obrigatório)
      nome: 'Usuário Teste Supabase',
      email: 'teste-supabase-' + Date.now() + '@exemplo.com',
      // Outros campos opcionais
      documento: '12345678901234',
      documento_tipo: 'cnpj',
      razaosocial: 'Razão Social Teste Supabase',
      nomefantasia: 'Nome Fantasia Teste Supabase',
      whatsapp: '11999999999',
      created_at: new Date().toISOString()
    };
    
    console.log('Dados a serem inseridos:', data);
    
    // Inserir dados na tabela cadastro_empresas_sistema
    const { data: result, error } = await supabase
      .from('cadastro_empresas_sistema')
      .insert([data])
      .select();
    
    if (error) {
      console.error('Erro ao inserir dados:');
      console.error('Código:', error.code);
      console.error('Mensagem:', error.message);
      console.error('Detalhes:', error.details);
      console.error('Erro completo:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('Dados inseridos com sucesso!');
    console.log('Resultado:', result);
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar função principal
testSupabaseInsert().then(() => {
  console.log('Teste concluído.');
});
