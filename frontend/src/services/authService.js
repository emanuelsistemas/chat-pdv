import supabase from '../utils/supabaseClient';

/**
 * Serviço para gerenciar autenticação com Supabase
 */
export const authService = {
  /**
   * Registra um novo usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {Object} metadata - Metadados adicionais do usuário
   * @returns {Promise} Promise com os dados da resposta
   */
  async register(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Realiza login de um usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promise com os dados da resposta
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Realiza logout do usuário atual
   * @returns {Promise} Promise com os dados da resposta
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  /**
   * Obtém o usuário atual
   * @returns {Object|null} Usuário atual ou null
   */
  getCurrentUser() {
    return supabase.auth.getUser();
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} true se o usuário estiver autenticado
   */
  async isAuthenticated() {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
};

export default authService;
