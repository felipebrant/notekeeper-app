import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TrashPage from './pages/TrashPage';

// Hook personalizado para gerir o tema (lógica do Dark Mode)
function useTheme() {
  // 1. Tenta ler o tema do localStorage, ou usa 'light' como padrão
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // 2. Sempre que o 'theme' mudar, atualiza o localStorage E o HTML
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Adiciona o atributo data-theme="light" ou data-theme="dark" ao <html>
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Função para trocar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const navigate = useNavigate();

  // 4. Usamos o nosso novo hook
  const { theme, toggleTheme } = useTheme();

  // Verifica se o utilizador já está logado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Funções de Login e Logout
  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
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
      
      {/* --- ROTAS PRIVADAS (O NOVO LAYOUT) --- */}
      <Route
        path="/"
        element={
          user ? (
            <Layout
              user={user}
              onLogout={handleLogout}
              onOpenTagManager={() => setIsTagModalOpen(true)}
              // 5. Passamos o tema e a função de troca para o Layout
              theme={theme}
              toggleTheme={toggleTheme}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        {/* Páginas Filhas */}
        <Route
          path="dashboard"
          element={
            <DashboardPage
              user={user}
              isTagModalOpen={isTagModalOpen}
              setIsTagModalOpen={setIsTagModalOpen}
            />
          }
        />
        <Route
          path="trash"
          element={<TrashPage user={user} onLogout={handleLogout} />}
        />
        <Route
          index
          element={<Navigate to="/dashboard" />}
        />
      </Route>
    </Routes>
  );
}