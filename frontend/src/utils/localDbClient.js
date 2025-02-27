import axios from 'axios';

// URL base da API
const API_BASE_URL = 'http://localhost:3000';

const localDbClient = {
  /**
   * Verifica se um documento já existe no banco
   * @param {string} documento - Documento a verificar
   * @returns {Promise<boolean>} Promise que resolve para true se o documento existe
   */
  async checkDocumentExists(documento) {
    console.log('Iniciando verificação de documento:', documento);
    try {
      // Usar a nova rota com query string
      console.log('Enviando requisição para:', `${API_BASE_URL}/api/check-documento?documento=${encodeURIComponent(documento)}`);
      const response = await axios.get(`${API_BASE_URL}/api/check-documento`, {
        params: { documento }
      });
      
      console.log('Resposta da verificação de documento:', response.data);
      return response.data.exists;
    } catch (error) {
      console.error('Erro completo ao verificar documento:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Adicionar notificação de erro mas continuar o fluxo para não bloquear
      // Em caso de erro, retornar false para não bloquear o fluxo
      return false;
    }
  },

  /**
   * Registra um novo usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @param {object} metadata - Dados adicionais do usuário
   * @returns {Promise} Promise com o resultado do registro
   */
  async signUp(email, senha, metadata = {}) {
    console.log('Iniciando cadastro de usuário:', { email, ...metadata });
    try {
      console.log('Enviando requisição para o servidor:', `${API_BASE_URL}/api/register`);
      const payload = {
        email,
        senha,
        ...metadata
      };
      console.log('Payload da requisição:', JSON.stringify(payload));
      
      const response = await axios.post(`${API_BASE_URL}/api/register`, payload);
      
      console.log('Resposta do servidor:', response.status, response.data);
      
      // Armazenar informações do usuário no localStorage
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Usuário armazenado no localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro completo ao registrar:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      return { 
        error: error.response?.data?.error || error.message || 'Erro ao cadastrar usuário',
        message: error.response?.data?.message || ''
      };
    }
  },

  /**
   * Realiza login de um usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise} Promise com o resultado do login
   */
  async signIn(email, senha) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        senha
      });
      
      // Armazenar informações do usuário no localStorage
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        error: error.response?.data?.message || error.message || 'Credenciais inválidas' 
      };
    }
  },

  /**
   * Faz logout do usuário atual
   * @returns {Promise} Promise com o resultado do logout
   */
  signOut() {
    localStorage.removeItem('user');
    return { success: true };
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} True se o usuário está autenticado, false caso contrário
   */
  isAuthenticated() {
    return !!localStorage.getItem('user');
  },

  /**
   * Obtém o usuário atualmente autenticado
   * @returns {Object|null} Usuário atual ou null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erro ao parsear usuário:', error);
      return null;
    }
  },

  /**
   * Atualiza o perfil do usuário
   * @param {string} userId - ID do usuário
   * @param {object} data - Dados a serem atualizados
   * @returns {Promise} Promise com o resultado da atualização
   */
  async updateProfile(userId, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/profile/${userId}`, data);
      
      // Atualizar informações do usuário no localStorage
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        error: error.response?.data?.message || error.message || 'Erro ao atualizar perfil' 
      };
    }
  }
};

export default localDbClient;
