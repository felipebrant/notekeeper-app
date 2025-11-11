import React from 'react';
// 1. Importamos os ícones de Sol e Lua
import { FaLightbulb, FaSearch, FaSun, FaMoon } from 'react-icons/fa';

// 2. Recebe 'theme' e 'toggleTheme' do Layout.jsx
export default function Header({ user, onLogout, theme, toggleTheme }) {
  return (
    <header className="app-header">
      
      {/* Parte Esquerda: Logo e Título */}
      <div className="header-group header-left">
        <FaLightbulb className="header-icon" />
        <h1>NoteKeeper</h1>
      </div>
      
      {/* Parte Central: Pesquisa (Placeholder) */}
      <div className="header-group header-center">
        <div className="header-search-placeholder">
          <FaSearch />
          <span>Pesquisar...</span>
        </div>
      </div>
      
      {/* Parte Direita: Informação do Utilizador */}
      <div className="header-group header-right">
        
        {/* 3. O NOVO BOTÃO DE TEMA */}
        <button
          onClick={toggleTheme}
          className="header-button theme-toggle"
          title={theme === 'light' ? 'Mudar para Modo Noturno' : 'Mudar para Modo Claro'}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        
        <span>Olá, {user?.name.split(' ')[0]}!</span>
        <button onClick={onLogout} className="logout-button">
          Sair
        </button>
      </div>
    </header>
  );
}