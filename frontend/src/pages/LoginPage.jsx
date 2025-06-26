    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';

    function LoginPage({ onLogin }) {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
          const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
          onLogin(data);
          navigate('/dashboard'); 
        } catch (error) {
          setError('Email ou senha inválidos!');
        }
      };

      return (
        <div className="login-page-container">
          <div className="login-form-container">
            <h1>Entrar no NoteKeeper</h1>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Entrar</button>
              {error && <p className="login-error">{error}</p>}
            </form>
            {/* LINK ADICIONADO AQUI */}
            <div className="auth-link">
              <Link to="/register">Não tem uma conta? Cadastre-se</Link>
            </div>
          </div>
        </div>
      );
    }

    export default LoginPage;
    