import React, { useState, useEffect } from 'react';
// 1. Importamos o 'Outlet' para o nosso novo layout privado
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // <-- O nosso dashboard de Notas
import TrashPage from './pages/TrashPage';
import BoardsDashboardPage from './pages/BoardsDashboardPage';
import BoardDetailPage from './pages/BoardDetailPage';

// Hook personalizado para gerir o tema (lógica do Dark Mode)
function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}

// --- 2. O NOSSO NOVO "GUARDA" DE ROTAS PRIVADAS ---
// Este componente verifica se o utilizador está logado.
const PrivateLayout = ({
  user,
  onLogout,
  onOpenTagManager,
  theme,
  toggleTheme,
}) => {
  if (!user) {
    // Se não há utilizador, redireciona para a página de login
    return <Navigate to="/" replace />;
  }

  // Se o utilizador existe, mostra o Layout (com a sidebar e o header)
  return (
    <Layout
      user={user}
      onLogout={onLogout}
      onOpenTagManager={onOpenTagManager}
      theme={theme}
      toggleTheme={toggleTheme}
    />
    // O <Outlet /> dentro do Layout irá renderizar
    // as rotas filhas (DashboardPage, TrashPage, etc.)
  );
};

// --- O NOSSO COMPONENTE APP PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Verifica se o utilizador já está logado (sem alterações)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Funções de Login e Logout (sem alterações)
  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/dashboard'); // O login leva-o para as Notas Pessoais por defeito
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // Manda o utilizador para a página de login
  };

  return (
    // 3. A NOVA ESTRUTURA DE ROTAS (limpa e correta)
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      {/* A página de Login agora é a nossa rota raiz "/" */}
      <Route
        path="/"
        element={
          !user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />
        }
      />
      <Route
        path="/register"
        element={
          !user ? <RegisterPage /> : <Navigate to="/dashboard" />
        }
      />
      
      {/* --- ROTAS PRIVADAS --- */}
      {/* Todas as rotas aqui dentro são "guardadas" pelo PrivateLayout */}
      <Route
        element={
          <PrivateLayout
            user={user}
            onLogout={handleLogout}
            onOpenTagManager={() => setIsTagModalOpen(true)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      >
        {/* Módulo de Notas Pessoais */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              user={user}
              isTagModalOpen={isTagModalOpen}
              setIsTagModalOpen={setIsTagModalOpen}
            />
          }
        />
        <Route
          path="/trash"
          element={<TrashPage user={user} onLogout={handleLogout} />}
        />
        
        {/* Módulo Trello */}
        <Route
          path="/boards"
          element={<BoardsDashboardPage user={user} />}
        />
        <Route
          path="/boards/:boardId"
          element={<BoardDetailPage user={user} />}
        />
      </Route>
      
      {/* Rota "apanha-tudo" - se não encontrar, volta ao início */}
      <Route path="*" element={<Navigate to="/" />} />
      
    </Routes>
  );
}