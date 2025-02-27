// Script para configurar o campo id para ser preenchido automaticamente
const { Pool } = require('pg');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

async function configureAutoId() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Iniciando configuração de ID automático...');
    
    // Iniciar uma transação
    await client.query('BEGIN');
    
    // 1. Verificar se a extensão pgcrypto está instalada (necessária para gen_random_uuid())
    console.log('Verificando se a extensão pgcrypto está instalada...');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);
    console.log('Extensão pgcrypto instalada/verificada com sucesso!');
    
    // 2. Modificar a coluna id para usar um valor padrão gerado automaticamente
    console.log('Configurando o campo id para usar um valor padrão gerado automaticamente...');
    await client.query(`
      ALTER TABLE cadastro_empresas_sistema
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    `);
    console.log('Campo id configurado com sucesso!');
    
    // 3. Verificar a configuração
    const result = await client.query(`
      SELECT column_name, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'cadastro_empresas_sistema' AND column_name = 'id';
    `);
    console.log('Configuração atual do campo id:');
    console.log(result.rows[0]);
    
    // Confirmar transação
    await client.query('COMMIT');
    console.log('Todas as alterações foram aplicadas com sucesso!');
    
  } catch (error) {
    // Em caso de erro, reverter transação
    await client.query('ROLLBACK');
    console.error('Erro ao configurar ID automático:', error);
    console.error('A transação foi revertida. Nenhuma alteração foi aplicada.');
  } finally {
    // Liberar cliente de volta para o pool
    client.release();
    // Fechar o pool completamente
    await pool.end();
  }
}

// Executar função principal
configureAutoId().then(() => {
  console.log('Processo concluído.');
}).catch(err => {
  console.error('Erro durante a execução do programa:', err);
  process.exit(1);
});
