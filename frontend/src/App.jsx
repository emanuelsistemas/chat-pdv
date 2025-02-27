import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Cadastro from './Cadastro';
import Login from './Login';
import { ToastProvider } from './contexts/ToastContext';

// Componente para o botão de alternar tema
const ThemeToggle = ({ temaEscuro, alternarTema }) => {
  return (
    <div className="w-full px-4 py-3 flex justify-end">
      <button 
        onClick={alternarTema} 
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-dark-300 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-dark-200 transition-colors"
      >
        {temaEscuro ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span>Modo Escuro</span>
          </>
        )}
      </button>
    </div>
  );
};

// Layout principal que envolve todas as páginas
const Layout = ({ children, temaEscuro, alternarTema }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <ThemeToggle temaEscuro={temaEscuro} alternarTema={alternarTema} />
      <div className="w-full container mx-auto px-4 flex flex-col items-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [temaEscuro, setTemaEscuro] = useState(true);

  // Aplicar classe dark ao elemento HTML
  useEffect(() => {
    if (temaEscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [temaEscuro]);

  const alternarTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <Layout temaEscuro={temaEscuro} alternarTema={alternarTema}>
              <Login />
            </Layout>
          } />
          <Route path="/cadastro" element={
            <Layout temaEscuro={temaEscuro} alternarTema={alternarTema}>
              <Cadastro />
            </Layout>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
