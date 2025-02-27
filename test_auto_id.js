// Script para testar a inserção de um registro sem fornecer o campo id
const { Pool } = require('pg');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

async function testAutoId() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Testando inserção com ID automático...');
    
    // Inserir um registro sem fornecer o campo id
    const insertQuery = `
      INSERT INTO cadastro_empresas_sistema (
        nome, 
        email, 
        documento, 
        documento_tipo, 
        razaosocial, 
        nomefantasia, 
        whatsapp, 
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *;
    `;
    
    // Gerar um número de documento único usando timestamp
    const uniqueDocument = '9' + Date.now().toString().substring(0, 11);
    console.log('Usando documento único:', uniqueDocument);
    
    const insertValues = [
      'Usuário Teste Auto ID',
      'teste-auto-id-' + Date.now() + '@exemplo.com', // Email único
      uniqueDocument, // Documento único
      'cnpj',
      'Razão Social Teste Auto ID',
      'Nome Fantasia Teste Auto ID',
      '11999999999',
      new Date()
    ];
    
    const result = await client.query(insertQuery, insertValues);
    console.log('Registro inserido com sucesso!');
    console.log('Dados do registro (observe o ID gerado automaticamente):', result.rows[0]);
    
  } catch (error) {
    console.error('Erro ao inserir registro:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar função principal
testAutoId().then(() => {
  console.log('Teste concluído.');
}).catch(err => {
  console.error('Erro durante a execução do teste:', err);
});
