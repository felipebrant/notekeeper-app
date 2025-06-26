import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post('http://localhost:5000/api/users', { name, email, password }, config);
      
      
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
        <div className="auth-link">
          <Link to="/">Já tem uma conta? Entre aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
