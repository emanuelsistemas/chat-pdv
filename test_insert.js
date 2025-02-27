// Script para testar a inserção de um registro na tabela cadastro_empresas_sistema
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

async function testInsert() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Testando inserção...');
    
    // Gerar um UUID para o registro
    const id = uuidv4();
    console.log('ID gerado:', id);
    
    // Inserir um registro de teste
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
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *;
    `;
    
    const insertValues = [
      id,
      'Usuário Teste',
      'teste@exemplo.com',
      '12345678901234',
      'cnpj',
      'Razão Social Teste',
      'Nome Fantasia Teste',
      '11999999999',
      new Date()
    ];
    
    const result = await client.query(insertQuery, insertValues);
    console.log('Registro inserido com sucesso!');
    console.log('Dados do registro:', result.rows[0]);
    
  } catch (error) {
    console.error('Erro ao inserir registro:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar função principal
testInsert().then(() => {
  console.log('Teste concluído.');
}).catch(err => {
  console.error('Erro durante a execução do teste:', err);
});
