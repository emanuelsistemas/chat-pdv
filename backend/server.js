const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Pool de conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '192.168.128.4', // IP do contêiner do PostgreSQL
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your-super-secret-and-long-postgres-password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint de verificação de saúde do servidor
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ status: 'ok', message: 'Conexão com o banco de dados estabelecida com sucesso.' });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    res.status(500).json({ status: 'offline', error: error.message });
  }
});

// API para verificar se um CNPJ já existe
app.get('/api/check-cnpj/:cnpj', async (req, res) => {
  let { cnpj } = req.params;
  
  try {
    // Remover formatação do CNPJ (pontos, barras, etc)
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verificar se a tabela existe
    const tableCheckResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cadastro_empresas_sistema'
      )
    `);
    
    const tableExists = tableCheckResult.rows[0].exists;
    
    if (!tableExists) {
      // Se a tabela não existir, criar a tabela
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.cadastro_empresas_sistema (
          id UUID PRIMARY KEY,
          nome TEXT NOT NULL,
          email TEXT NOT NULL,
          documento TEXT,
          documento_tipo TEXT,
          tipo_empresa TEXT,
          razao_social TEXT,
          nome_fantasia TEXT,
          whatsapp TEXT,
          senha_hash TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      // Criar índice único para documento
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_documento_unique 
        ON public.cadastro_empresas_sistema (documento) 
        WHERE documento IS NOT NULL
      `);
      
      // Como acabamos de criar a tabela, o CNPJ não existe
      return res.json({ exists: false });
    }
    
    // Verificar se o CNPJ existe - removendo qualquer formatação no banco também
    const result = await pool.query(
      "SELECT id FROM cadastro_empresas_sistema WHERE REPLACE(documento, '-', '') = $1 OR documento = $1",
      [cnpj]
    );
    
    res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error('Erro ao verificar CNPJ:', error);
    res.status(500).json({ error: error.message });
  }
});

// Nova API para verificar se um CNPJ já existe (usando query string)
app.get('/api/check-documento', async (req, res) => {
  console.log('Recebida requisição para verificar documento:', req.query);
  let { documento } = req.query;
  
  if (!documento) {
    console.log('Erro: Documento não fornecido');
    return res.status(400).json({ error: 'Documento não fornecido' });
  }
  
  try {
    console.log('Documento original:', documento);
    // Remover formatação do documento (pontos, barras, etc)
    documento = documento.replace(/[^\d]/g, '');
    console.log('Documento limpo:', documento);
    
    // Verificar se o documento existe
    const queryText = "SELECT id FROM cadastro_empresas_sistema WHERE REPLACE(documento, '-', '') = $1 OR documento = $1";
    console.log('Executando query:', queryText, 'com valor:', documento);
    
    const result = await pool.query(queryText, [documento]);
    console.log('Resultado da query:', result.rows);
    
    const exists = result.rows.length > 0;
    console.log('Documento existe?', exists);
    
    res.json({ exists });
  } catch (error) {
    console.error('Erro ao verificar documento:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    res.status(500).json({ error: error.message });
  }
});

// API para registrar usuário
app.post('/api/register', async (req, res) => {
  console.log('Recebida requisição de registro:', req.body);
  
  const { 
    email, 
    senha, 
    nome, 
    documento, 
    documento_tipo, 
    tipoEmpresa: tipo_empresa, 
    razaoSocial: razao_social, 
    nomeFantasia: nome_fantasia, 
    whatsapp 
  } = req.body;
  
  console.log('Dados processados:', { 
    email, 
    senha: senha ? '[REDACTED]' : 'não fornecido', 
    nome, 
    documento, 
    documento_tipo, 
    tipo_empresa, 
    razao_social, 
    nome_fantasia, 
    whatsapp 
  });
  
  // Validar campos obrigatórios
  if (!email || !senha || !nome) {
    console.log('Erro: campos obrigatórios faltando');
    return res.status(400).json({ 
      error: 'Campos obrigatórios não preenchidos',
      message: 'Email, senha e nome são obrigatórios'
    });
  }
  
  try {
    // Verificar se o e-mail já existe
    console.log('Verificando se e-mail já existe:', email);
    const emailCheck = await pool.query(
      'SELECT id FROM cadastro_empresas_sistema WHERE email = $1',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      console.log('E-mail já cadastrado:', email);
      return res.status(400).json({ 
        error: 'E-mail já cadastrado',
        message: 'Este e-mail já está sendo utilizado por outro usuário'
      });
    }
    
    // Verificar se o documento já existe (se fornecido)
    if (documento) {
      // Limpar formatação do documento
      const documentoLimpo = documento.replace(/[^\d]/g, '');
      console.log('Verificando se documento já existe:', documentoLimpo);
      
      const documentoCheck = await pool.query(
        "SELECT id FROM cadastro_empresas_sistema WHERE REPLACE(documento, '-', '') = $1 OR documento = $1",
        [documentoLimpo]
      );
      
      if (documentoCheck.rows.length > 0) {
        console.log('Documento já cadastrado:', documentoLimpo);
        return res.status(400).json({ 
          error: 'Documento já cadastrado',
          message: 'Este documento já está cadastrado no sistema'
        });
      }
    }
    
    // Gerar hash da senha
    console.log('Gerando hash da senha');
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    // Gerar ID único
    const id = uuidv4();
    console.log('ID gerado:', id);
    
    // Inserir usuário no banco
    console.log('Inserindo usuário no banco de dados');
    const insertQuery = `INSERT INTO cadastro_empresas_sistema (
      id, 
      nome, 
      email, 
      documento, 
      documento_tipo, 
      tipoempresa, 
      razaosocial, 
      nomefantasia, 
      whatsapp, 
      senha_hash
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    
    const insertValues = [
      id, 
      nome, 
      email, 
      documento ? documento.replace(/[^\d]/g, '') : null, 
      documento_tipo, 
      tipo_empresa, 
      razao_social, 
      nome_fantasia || nome, 
      whatsapp,
      senhaHash
    ];
    
    console.log('Query de inserção:', insertQuery);
    console.log('Valores para inserção:', [
      id, 
      nome, 
      email, 
      documento ? documento.replace(/[^\d]/g, '') : null, 
      documento_tipo, 
      tipo_empresa, 
      razao_social, 
      nome_fantasia || nome, 
      whatsapp,
      '[REDACTED]' // Ocultar senha hash nos logs
    ]);
    
    await pool.query(insertQuery, insertValues);
    
    console.log('Usuário registrado com sucesso:', id);
    res.status(201).json({ 
      user: { 
        id, 
        email, 
        nome, 
        documento_tipo,
        documento
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      internalPosition: error.internalPosition,
      internalQuery: error.internalQuery,
      where: error.where,
      schema: error.schema,
      table: error.table,
      column: error.column,
      dataType: error.dataType,
      constraint: error.constraint
    });
    
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message,
      code: error.code
    });
  }
});

// API para login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // Buscar usuário pelo e-mail
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash FROM cadastro_empresas_sistema WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }
    
    const user = result.rows[0];
    
    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }
    
    // Criar sessão (simples para este exemplo)
    const session = {
      id: uuidv4(),
      user_id: user.id,
      created_at: new Date()
    };
    
    // Em um sistema real, armazenaria a sessão no banco e usaria JWT
    
    res.json({ 
      session: session.id,
      user: { 
        id: user.id, 
        email: user.email, 
        nome: user.nome
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: error.message });
  }
});

// API para obter perfil do usuário
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT id, nome, email, documento, documento_tipo, tipo_empresa, 
       razao_social, nome_fantasia, whatsapp, created_at 
       FROM cadastro_empresas_sistema 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inicializar tabelas se não existirem
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Verificar e criar tabela de usuários
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.cadastro_empresas_sistema (
          id UUID PRIMARY KEY,
          nome TEXT NOT NULL,
          email TEXT NOT NULL,
          documento TEXT,
          documento_tipo TEXT,
          tipoempresa TEXT,
          razaosocial TEXT,
          nomefantasia TEXT,
          whatsapp TEXT,
          senha_hash TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      // Criar índices
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_email_unique 
        ON public.cadastro_empresas_sistema (email)
      `);
      
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS cadastro_empresas_sistema_documento_unique 
        ON public.cadastro_empresas_sistema (documento) 
        WHERE documento IS NOT NULL
      `);
      
      await client.query('COMMIT');
      console.log('Banco de dados inicializado com sucesso');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

// Iniciar servidor
app.listen(process.env.PORT || 3001, async () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
  await initializeDatabase();
});
