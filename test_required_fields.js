// Script para testar a inserção de um registro com apenas os campos obrigatórios
const { Pool } = require('pg');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

async function testRequiredFields() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Testando inserção com apenas campos obrigatórios...');
    
    // Inserir um registro com apenas os campos obrigatórios
    const insertQuery = `
      INSERT INTO cadastro_empresas_sistema (
        nome, 
        email
        -- Não incluindo outros campos, apenas os obrigatórios
      ) VALUES (
        $1, $2
      ) RETURNING *;
    `;
    
    // Gerar valores únicos para evitar violações de unicidade
    const uniqueEmail = 'teste-required-' + Date.now() + '@exemplo.com';
    
    const insertValues = [
      'Usuário Teste Campos Obrigatórios',
      uniqueEmail
    ];
    
    const result = await client.query(insertQuery, insertValues);
    console.log('Registro inserido com sucesso!');
    console.log('Dados do registro (observe os campos preenchidos automaticamente):', result.rows[0]);
    
  } catch (error) {
    console.error('Erro ao inserir registro:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar função principal
testRequiredFields().then(() => {
  console.log('Teste concluído.');
}).catch(err => {
  console.error('Erro durante a execução do teste:', err);
});
