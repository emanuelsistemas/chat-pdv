import supabase from '../utils/supabaseClient';

/**
 * Serviço para gerenciar dados de usuários no Supabase
 */
export const userService = {
  /**
   * Cria um novo perfil de usuário após o registro
   * @param {Object} userData - Dados do usuário
   * @returns {Promise} Promise com os dados da resposta
   */
  async createProfile(userData) {
    const { data, error } = await supabase
      .from('cadastro_empresas_sistema')
      .insert([{
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        documento: userData.documento,
        documento_tipo: userData.documento_tipo,
        tipoEmpresa: userData.tipoEmpresa,
        razaoSocial: userData.razaoSocial || null,
        nomeFantasia: userData.nomeFantasia || null,
        whatsapp: userData.whatsapp,
        created_at: new Date()
      }])
      .select();
    
    return { data, error };
  },

  /**
   * Obtém o perfil do usuário pelo ID
   * @param {string} userId - ID do usuário
   * @returns {Promise} Promise com os dados da resposta
   */
  async getProfileById(userId) {
    const { data, error } = await supabase
      .from('cadastro_empresas_sistema')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Atualiza o perfil do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} updateData - Dados a serem atualizados
   * @returns {Promise} Promise com os dados da resposta
   */
  async updateProfile(userId, updateData) {
    const { data, error } = await supabase
      .from('cadastro_empresas_sistema')
      .update(updateData)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data;
  }
};

export default userService;
