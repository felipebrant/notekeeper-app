import React, { useState } from 'react';
import axios from 'axios';
// 1. Importa o Link para navegar para a página de registo
import { Link } from 'react-router-dom';

// 2. Recebe o 'onLogin' como prop do App.jsx
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );
      // 3. Chama a função onLogin com os dados do utilizador e o token
      onLogin(data, data.token);
    } catch (err) {
      setError('Email ou senha inválidos.');
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h1>Entrar no NoteKeeper</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
        {/* 4. Link correto para a página de registo */}
        <p className="auth-link">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}