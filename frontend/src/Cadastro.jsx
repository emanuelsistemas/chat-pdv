import React, { useState } from 'react';
import apiUrls from './config/apiUrls';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './components/ui/Logo';
import {
    SearchableDropdown,
    DocumentSelector,
    MaskedInput,
    PhoneInput,
    PasswordInput
} from './components/form';
import { useToast } from './contexts/ToastContext';

function Cadastro() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [formData, setFormData] = useState({
        tipoEmpresa: '',
        nome: '',
        documento: '',
        documentType: 'cnpj', // Valor padrão CNPJ
        razaoSocial: '',
        nomeFantasia: '',
        email: '',
        whatsapp: '',
        senha: '',
        confirmarSenha: '',
    });

    const [focusedInput, setFocusedInput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Lista de tipos de empresas
    const tiposEmpresa = [
        // Varejo Alimentício
        'Padaria', 'Confeitaria', 'Açougue', 'Peixaria', 'Mercearia',
        'Frutaria', 'Empório', 'Restaurante', 'Lanchonete', 'Bar',
        'Cafeteria', 'Sorveteria', 'Pizzaria', 'Hamburgueria', 'Distribuidora de Bebidas',

        // Varejo Não-Alimentício
        'Loja de Roupas', 'Loja de Calçados', 'Loja de Móveis', 'Loja de Eletrônicos',
        'Loja de Brinquedos', 'Livraria', 'Papelaria', 'Perfumaria', 'Farmácia',
        'Joalheria', 'Ótica', 'Loja de Materiais de Construção', 'Loja de Artesanato',
        'Loja de Decoração', 'Floricultura',

        // Serviços
        'Salão de Beleza', 'Barbearia', 'Academia', 'Estúdio de Yoga', 'Pet Shop',
        'Clínica Veterinária', 'Lavanderia', 'Oficina Mecânica', 'Auto Escola',
        'Agência de Viagens', 'Hotel', 'Pousada',

        // Atacado
        'Atacado de Alimentos', 'Atacado de Bebidas', 'Atacado de Roupas',
        'Atacado de Calçados', 'Atacado de Eletrônicos', 'Atacado de Materiais de Construção',

        // Outros
        'Escritório de Contabilidade', 'Escritório de Advocacia', 'Consultoria',
        'Imobiliária', 'Escola', 'Centro de Treinamento', 'Gráfica',
        'Estúdio Fotográfico', 'Agência de Marketing', 'Agência de Publicidade'
    ].sort();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFocus = (field) => {
        setFocusedInput(field);
    };

    const handleBlur = (field) => {
        setFocusedInput(null);
    };

    const handleTipoEmpresaChange = (novoTipo) => {
        setFormData({
            ...formData,
            tipoEmpresa: novoTipo
        });
    };

    const handleDocumentChange = (e) => {
        handleInputChange(e);
        if (e.documentType) {
            setFormData({
                ...formData,
                documentType: e.documentType
            });
        }
    };

    const handleDocumentTypeChange = (type) => {
        setFormData({
            ...formData,
            documentType: type
        });

        // Limpa a razão social se mudar para CPF
        if (type === 'cpf') {
            setFormData({
                ...formData,
                documentType: type,
                razaoSocial: ''
            });
        }
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            console.log('Formulário submetido com os seguintes dados:', formData);

            // Validar campos
            if (!formData.email || !formData.senha || !formData.nome) {
                showError('Por favor, preencha todos os campos obrigatórios.');
                setIsLoading(false);
                return;
            }

            // Preparar dados para envio para o webhook do n8n
            const data = {
                email: formData.email,
                senha: formData.senha,
                nome: formData.nome,
                documento: formData.documento,
                documento_tipo: formData.documentType,
                tipoEmpresa: formData.tipoEmpresa,
                razaoSocial: formData.razaoSocial,
                nomeFantasia: formData.nomeFantasia || formData.nome,
                whatsapp: formData.whatsapp
            };

            console.log('Enviando dados para o webhook do n8n:', data);

            // Chamar o webhook do n8n
            const apiUrl = process.env.NODE_ENV === 'production' ? apiUrls.production.cadastroWebhook : apiUrls.development.cadastroWebhook;
            const response = await axios.post(apiUrl, data);

            console.log('Resposta do webhook do n8n:', response.data);

            // Processar a resposta do webhook
            if (response.data.success) {
                showSuccess(response.data.message);

                // Redirecionar para a página de login
                if (response.data.redirect && response.data.redirectUrl) {
                    setTimeout(() => {
                        navigate(response.data.redirectUrl);
                    }, 2000);
                }
            } else {
                showError(response.data.message);
            }

        } catch (error) {
            console.error('Erro ao cadastrar:', error);

            // Formatar mensagem de erro para exibir mais detalhes
            let errorMessage = 'Erro ao cadastrar: ';

            if (error.response) {
                // Erro do servidor com resposta
                errorMessage += error.response.data?.message || error.response.data?.error || error.message || 'Erro desconhecido';
            } else if (error.request) {
                // Erro de comunicação com o servidor
                errorMessage += 'Não foi possível se comunicar com o servidor. Verifique sua conexão.';
            } else {
                // Outros erros
                errorMessage += error.message || 'Erro desconhecido';
            }

            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Classes reutilizáveis
    const inputContainerClass = "mb-6";
    const inputWrapperClass = (field) => `relative border ${
        focusedInput === field ? 'border-accent-300 dark:border-accent-200' : 'border-gray-300 dark:border-gray-600'
    } rounded-lg transition-all duration-150 shadow-sm overflow-hidden`;
    const inputClass = "block w-full px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-white dark:bg-dark-300 appearance-none focus:outline-none";
    const labelClass = (field) => `absolute text-sm ${
        focusedInput === field || formData[field]
            ? 'transform -translate-y-2 scale-90 top-2 text-accent-300 dark:text-accent-200 left-4'
            : 'top-4 text-gray-500 dark:text-gray-400'
    } transition-all duration-150 pointer-events-none left-4`;

    return (
        <div className="w-full">
            <div className="flex justify-center mb-8">
                <Logo />
            </div>

            <div className="bg-white dark:bg-dark-200 rounded-lg shadow-xl overflow-hidden">
                <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-dark-400">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Criar conta</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Cadastre-se para começar a usar o Chat Food</p>
                </div>

                <form className="px-8 pt-6 pb-8" onSubmit={handleSubmit}>
                    {/* Tipo de Empresa (Dropdown) */}
                    <div className="mb-6">
                        <SearchableDropdown
                            id="tipoEmpresa"
                            value={formData.tipoEmpresa}
                            onChange={handleTipoEmpresaChange}
                            options={tiposEmpresa}
                            placeholder="Selecione o tipo de empresa"
                            label="Tipo de Empresa"
                        />
                    </div>

                    {/* Tipo de Documento (CNPJ/CPF) */}
                    <div className="mb-6">
                        <DocumentSelector
                            value={formData.documento}
                            onChange={handleDocumentChange}
                            defaultDocumentType="cnpj"
                            showValidation={true}
                            onDocumentTypeChange={handleDocumentTypeChange}
                        />
                    </div>

                    {/* Razão Social (apenas se for CNPJ) */}
                    {formData.documentType === 'cnpj' && (
                        <div className={inputContainerClass}>
                            <div className={inputWrapperClass('razaoSocial')}>
                                <input
                                    id="razaoSocial"
                                    name="razaoSocial"
                                    type="text"
                                    value={formData.razaoSocial}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus('razaoSocial')}
                                    onBlur={() => handleBlur('razaoSocial')}
                                    className={inputClass}
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="razaoSocial"
                                    className={labelClass('razaoSocial')}
                                >
                                    Razão Social
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Nome Fantasia */}
                    <div className={inputContainerClass}>
                        <div className={inputWrapperClass('nomeFantasia')}>
                            <input
                                id="nomeFantasia"
                                name="nomeFantasia"
                                type="text"
                                value={formData.nomeFantasia}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('nomeFantasia')}
                                onBlur={() => handleBlur('nomeFantasia')}
                                className={inputClass}
                                placeholder=" "
                            />
                            <label
                                htmlFor="nomeFantasia"
                                className={labelClass('nomeFantasia')}
                            >
                                Nome Fantasia
                            </label>
                        </div>
                    </div>

                    {/* Nome */}
                    <div className={inputContainerClass}>
                        <div className={inputWrapperClass('nome')}>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                value={formData.nome}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus('nome')}
                                onBlur={() => handleBlur('nome')}
                                className={inputClass}
                                placeholder=" "
                            />
                            <label
                                htmlFor="nome"
                                className={labelClass('nome')}
                            >
                                Nome Completo
                            </label>
                        </div>
                    </div>

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

                    {/* WhatsApp */}
                    <div className={inputContainerClass}>
                        <PhoneInput
                            id="whatsapp"
                            name="whatsapp"
                            label="WhatsApp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Senha */}
                    <div className={inputContainerClass}>
                        <PasswordInput
                            id="senha"
                            name="senha"
                            label="Senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Confirmar Senha */}
                    <div className={inputContainerClass}>
                        <PasswordInput
                            id="confirmarSenha"
                            name="confirmarSenha"
                            label="Confirmar Senha"
                            value={formData.confirmarSenha}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Botão e Link */}
                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 ${
                                isLoading ? 'bg-accent-300/70 cursor-not-allowed' : 'bg-accent-300 hover:bg-accent-400'
                            } text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-opacity-50`}
                        >
                            {isLoading ? 'Processando...' : 'Criar Conta'}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600 dark:text-gray-300">Já tem uma conta? </span>
                            <Link to="/login" className="text-accent-300 dark:text-accent-200 hover:text-accent-400 dark:hover:text-accent-100 font-medium">
                                Entrar
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Cadastro;