// Script para remover a restrição de chave estrangeira que está causando o problema
const { Pool } = require('pg');

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4',
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

async function fixConstraint() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Iniciando correções...');
    
    // Iniciar uma transação
    await client.query('BEGIN');
    
    // 1. Verificar a restrição existente
    console.log('Verificando restrições existentes...');
    const constraintQuery = `
      SELECT conname, conrelid::regclass AS table_name, a.attname AS column_name, 
             confrelid::regclass AS foreign_table_name, af.attname AS foreign_column_name
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      JOIN pg_attribute af ON af.attrelid = c.confrelid AND af.attnum = ANY(c.confkey)
      WHERE contype = 'f' AND conrelid::regclass::text = 'cadastro_empresas_sistema';
    `;
    
    const constraintResult = await client.query(constraintQuery);
    console.log('Restrições encontradas:', constraintResult.rows);
    
    // 2. Remover a restrição de chave estrangeira
    if (constraintResult.rows.length > 0) {
      const constraintName = constraintResult.rows[0].conname;
      console.log(`Removendo restrição: ${constraintName}`);
      
      await client.query(`
        ALTER TABLE cadastro_empresas_sistema
        DROP CONSTRAINT ${constraintName};
      `);
      console.log('Restrição removida com sucesso!');
    } else {
      console.log('Nenhuma restrição de chave estrangeira encontrada.');
    }
    
    // 3. Verificar se a tabela tem uma coluna user_id
    const columnQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'cadastro_empresas_sistema' AND column_name = 'user_id';
    `;
    
    const columnResult = await client.query(columnQuery);
    
    // 4. Adicionar coluna user_id se não existir
    if (columnResult.rows.length === 0) {
      console.log('Adicionando coluna user_id...');
      await client.query(`
        ALTER TABLE cadastro_empresas_sistema
        ADD COLUMN user_id UUID NULL;
      `);
      console.log('Coluna user_id adicionada com sucesso!');
    } else {
      console.log('Coluna user_id já existe.');
    }
    
    // 5. Adicionar uma nova restrição opcional
    console.log('Adicionando nova restrição opcional...');
    await client.query(`
      ALTER TABLE cadastro_empresas_sistema
      ADD CONSTRAINT fk_auth_users_optional
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE SET NULL;
    `);
    console.log('Nova restrição adicionada com sucesso!');
    
    // Confirmar transação
    await client.query('COMMIT');
    console.log('Todas as alterações foram aplicadas com sucesso!');
    
  } catch (error) {
    // Em caso de erro, reverter transação
    await client.query('ROLLBACK');
    console.error('Erro ao executar script:', error);
    console.error('A transação foi revertida. Nenhuma alteração foi aplicada.');
  } finally {
    // Liberar cliente de volta para o pool
    client.release();
    // Fechar o pool completamente
    await pool.end();
  }
}

// Executar função principal
fixConstraint().then(() => {
  console.log('Processo concluído.');
}).catch(err => {
  console.error('Erro durante a execução do programa:', err);
  process.exit(1);
});
