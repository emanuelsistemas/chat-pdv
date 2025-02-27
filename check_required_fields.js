// Script para verificar campos obrigatórios na tabela cadastro_empresas_sistema
const { Pool } = require('pg');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

async function checkRequiredFields() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'cadastro_empresas_sistema'
      ORDER BY ordinal_position;
    `);
    
    console.log('Campos da tabela cadastro_empresas_sistema:');
    console.log('------------------------------------------');
    for (const row of result.rows) {
      const isRequired = row.is_nullable === 'NO';
      const hasDefault = row.column_default !== null;
      
      console.log(`${row.column_name}: ${row.data_type}`);
      console.log(`  Obrigatório: ${isRequired ? 'SIM' : 'NÃO'}`);
      console.log(`  Valor padrão: ${hasDefault ? row.column_default : 'Nenhum'}`);
      console.log('------------------------------------------');
    }
  } catch (error) {
    console.error('Erro ao verificar campos:', error);
  } finally {
    await pool.end();
  }
}

// Executar função principal
checkRequiredFields().then(() => {
  console.log('Verificação concluída.');
}).catch(err => {
  console.error('Erro durante a execução:', err);
});
