// Script para corrigir a estrutura do banco de dados
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do Pool de conexão com o PostgreSQL - mesma do servidor
const pool = new Pool({
  user: 'postgres',
  host: '192.168.128.4', // IP do contêiner do PostgreSQL
  database: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  port: 5432,
});

// Caminho para o script SQL
const sqlPath = path.join(__dirname, 'create_user_and_empresa.sql');
const sqlScript = fs.readFileSync(sqlPath, 'utf8');

// Função para executar o script SQL
async function executeSQL() {
  const client = await pool.connect();
  
  try {
    console.log('Conectado ao banco de dados. Iniciando correções...');
    
    // Iniciar uma transação
    await client.query('BEGIN');
    
    console.log('Executando script SQL...');
    // Dividir e executar cada comando SQL separadamente
    const commands = sqlScript
      .replace(/--.*\n/g, '') // Remover comentários
      .split(';')
      .filter(cmd => cmd.trim() !== '');
    
    for (const command of commands) {
      try {
        console.log(`Executando: ${command.substring(0, 50)}...`);
        await client.query(command);
      } catch (err) {
        console.error(`Erro ao executar comando SQL: ${err.message}`);
        console.error(`Comando que falhou: ${command}`);
        await client.query('ROLLBACK');
        throw err;
      }
    }
    
    // Confirmar transação
    await client.query('COMMIT');
    console.log('Script SQL executado com sucesso!');
    console.log('Estrutura do banco de dados corrigida.');
    
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
executeSQL().then(() => {
  console.log('Processo concluído.');
}).catch(err => {
  console.error('Erro durante a execução do programa:', err);
  process.exit(1);
});
