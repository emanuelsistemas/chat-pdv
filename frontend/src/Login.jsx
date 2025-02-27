import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './components/ui/Logo';
import localDbClient from './utils/localDbClient';
import { useToast } from './contexts/ToastContext';

function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [focused, setFocused] = useState({
    email: false,
    senha: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFocus = (field) => {
    setFocused({
      ...focused,
      [field]: true
    });
  };

  const handleBlur = (field) => {
    setFocused({
      ...focused,
      [field]: formData[field].length > 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validar campos
      if (!formData.email || !formData.senha) {
        showError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }
      
      // Fazer login com o localDbClient
      const response = await localDbClient.signIn(formData.email, formData.senha);
      
      if (response.error) {
        // Verificar o tipo de erro para exibir mensagem mais amigável
        if (response.error.includes('inválidas') || response.error.includes('incorretos')) {
          showError('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        } else {
          const errorDetail = response.message || '';
          showError(`Erro ao fazer login: ${response.error}${errorDetail ? '\n' + errorDetail : ''}`);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Login bem-sucedido
      showSuccess('Login realizado com sucesso!');
      
      // Redirecionar para a página inicial após 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Formatar mensagem de erro para exibir mais detalhes
      let errorMessage = 'Erro ao fazer login: ';
      
      if (error.response) {
        // Erro do servidor com resposta
        if (error.response.status === 401) {
          errorMessage = 'Email ou senha incorretos. Por favor, verifique suas credenciais.';
        } else {
          errorMessage += error.response.data?.message || error.response.data?.error || error.message || 'Erro desconhecido';
        }
      } else if (error.request) {
        // Erro de comunicação com o servidor
        errorMessage += 'Não foi possível se comunicar com o servidor. Verifique sua conexão.';
      } else {
        // Outros erros
        errorMessage += error.message || 'Erro desconhecido';
      }
      
      showError(errorMessage);
      setIsLoading(false);
    }
  };

  // Classes reutilizáveis
  const inputContainerClass = "relative mb-6";
  const inputWrapperClass = (field) => `relative border ${focused[field] ? 'border-accent-300 dark:border-accent-200' : 'border-gray-300 dark:border-gray-600'} rounded-lg transition-all duration-150 shadow-sm overflow-hidden`;
  const inputClass = "block w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-white dark:bg-dark-300 appearance-none focus:outline-none peer";
  const labelClass = (field) => `absolute text-sm ${
    focused[field]
      ? 'transform -translate-y-2 scale-90 top-2 text-accent-300 dark:text-accent-200'
      : 'top-4 text-gray-500 dark:text-gray-400'
  } left-4 transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:transform peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:top-2 peer-focus:text-accent-300 dark:peer-focus:text-accent-200`;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-lg shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-dark-400">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Entrar</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Faça login para continuar usando o Chat Food</p>
        </div>

        <form className="px-8 pt-6 pb-8" onSubmit={handleSubmit}>
          {/* Email */}
          <div className={inputContainerClass}>
            <div className={inputWrapperClass('email')}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className={inputClass}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={labelClass('email')}
              >
                Email
              </label>
            </div>
          </div>

          {/* Senha */}
          <div className={inputContainerClass}>
            <div className={inputWrapperClass('senha')}>
              <input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                onFocus={() => handleFocus('senha')}
                onBlur={() => handleBlur('senha')}
                className={inputClass}
                placeholder=" "
              />
              <label
                htmlFor="senha"
                className={labelClass('senha')}
              >
                Senha
              </label>
            </div>
            <div className="mt-2 text-right">
              <a href="#" className="text-sm text-accent-300 dark:text-accent-200 hover:text-accent-400 dark:hover:text-accent-100">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          {/* Botão e Link */}
          <div className="flex flex-col gap-4 mt-8">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-accent-300 hover:bg-accent-400 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-opacity-50 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-300">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-accent-300 dark:text-accent-200 hover:text-accent-400 dark:hover:text-accent-100 font-medium">
                Criar Conta
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
