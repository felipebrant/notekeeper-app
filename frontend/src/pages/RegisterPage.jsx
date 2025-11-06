import React, { useState } from 'react';
import axios from 'axios';
// 1. Importa o Link e o useNavigate
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 2. Inicializa o hook de navegação
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users', {
        name,
        email,
        password,
      });
      setSuccess('Conta criada com sucesso! A redirecionar para o login...');
      // 3. Após 2 segundos, navega de volta para a página de login
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Falha ao criar a conta. O email já pode estar em uso.');
      console.error(err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
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
          <button type="submit">Cadastrar</button>
          {error && <p className="login-error">{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
        </form>
        <p className="auth-link">
          Já tem uma conta? <Link to="/">Faça o login</Link>
        </p>
      </div>
    </div>
  );
}