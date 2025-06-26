    import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    import DashboardPage from './pages/DashboardPage';

    function App() {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true); // Estado para saber se ainda estamos a verificar o login

      useEffect(() => {
        const loggedUserJSON = localStorage.getItem('user');
        if (loggedUserJSON) {
          setUser(JSON.parse(loggedUserJSON));
        }
        setLoading(false); // Terminámos a verificação inicial
      }, []);
      
      const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      };
      
      const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
      };

      if (loading) {
        return <div>A carregar...</div>; 
      }

      return (
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
            />
          </Routes>
        </Router>
      );
    }

    export default App;
    