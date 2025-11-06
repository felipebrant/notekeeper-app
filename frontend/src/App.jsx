import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TrashPage from './pages/TrashPage';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      {/* Rotas Públicas (Login e Registo) */}
      <Route
        path="/"
        element={
          !user ? <LoginPage onLogin={handleLogin} /> : <DashboardPage user={user} onLogout={handleLogout} />
        }
      />
      <Route
        path="/register"
        element={
          !user ? <RegisterPage /> : <DashboardPage user={user} onLogout={handleLogout} />
        }
      />
      
      {/* Rotas Privadas (Dashboard e Lixeira) */}
      <Route
        path="/dashboard"
        element={
          // --- A CORREÇÃO ESTÁ AQUI ---
          // Agora estamos a passar 'user={user}' para o Dashboard
          user ? <DashboardPage user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/trash"
        element={
          // --- E AQUI TAMBÉM ---
          // E também para a página da Lixeira
          user ? <TrashPage user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
        }
      />
    </Routes>
  );
}