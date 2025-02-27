// Script para testar o fluxo do n8n
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

// Simular os dados recebidos do formulário de cadastro
const formData = {
  nome: "Usuário Teste n8n",
  email: "teste-n8n@exemplo.com",
  documento: "12.345.678/0001-90",
  documento_tipo: "cnpj",
  razao_social: "Razão Social Teste n8n",
  nome_fantasia: "Nome Fantasia Teste n8n",
  whatsapp: "(11) 99999-9999",
  senha: "senha123"
};

// Função para processar os dados (similar ao que seria feito no nó de função do n8n)
function processData(data) {
  return {
    id: uuidv4(), // Gerar um UUID para o registro
    nome: data.nome,
    email: data.email,
    documento: data.documento.replace(/[^\d]/g, ''), // Remover formatação
    documento_tipo: data.documento_tipo || 'cnpj',
    razaosocial: data.razao_social || null,
    nomefantasia: data.nome_fantasia || data.nome,
    whatsapp: data.whatsapp ? data.whatsapp.replace(/[^\d]/g, '') : null,
    created_at: new Date().toISOString(),
    user_id: null // Este campo é opcional e pode ser nulo
  };
}

async function testN8nFlow() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Simulando fluxo do n8n...');
    
    // Processar os dados do formulário
    const processedData = processData(formData);
    console.log('Dados processados:', processedData);
    
    // Inserir um registro de teste (similar ao que seria feito no nó PostgreSQL do n8n)
    const insertQuery = `
      INSERT INTO cadastro_empresas_sistema (
        id, 
        nome, 
        email, 
        documento, 
        documento_tipo, 
        razaosocial, 
        nomefantasia, 
        whatsapp, 
        created_at,
        user_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *;
    `;
    
    const insertValues = [
      processedData.id,
      processedData.nome,
      processedData.email,
      processedData.documento,
      processedData.documento_tipo,
      processedData.razaosocial,
      processedData.nomefantasia,
      processedData.whatsapp,
      processedData.created_at,
      processedData.user_id
    ];
    
    const result = await client.query(insertQuery, insertValues);
    console.log('Registro inserido com sucesso!');
    console.log('Dados do registro:', result.rows[0]);
    
    // Simular a resposta do webhook
    const webhookResponse = {
      success: true,
      message: "Cadastro realizado com sucesso!",
      redirect: true,
      redirectUrl: "/login"
    };
    
    console.log('Resposta do webhook:', webhookResponse);
    
  } catch (error) {
    console.error('Erro ao simular fluxo do n8n:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar função principal
testN8nFlow().then(() => {
  console.log('Teste do fluxo do n8n concluído.');
}).catch(err => {
  console.error('Erro durante a execução do teste:', err);
});
