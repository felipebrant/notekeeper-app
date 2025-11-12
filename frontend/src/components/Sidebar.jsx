import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Importamos o ícone do Trello
import { FaStickyNote, FaTrash, FaTags, FaTrello } from 'react-icons/fa';

export default function Sidebar({ onOpenTagManager }) {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        
        {/* Link para o Módulo de Notas Pessoais */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaStickyNote /> <span>Notas Pessoais</span>
        </NavLink>

        {/* 2. NOVO LINK para o Módulo Trello */}
        <NavLink
          to="/boards"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaTrello /> <span>Meus Quadros</span>
        </NavLink>
        
        {/* Botão de Marcadores */}
        <button onClick={onOpenTagManager} className="sidebar-link-button">
          <FaTags /> <span>Editar Marcadores</span>
        </button>
        
        {/* Link da Lixeira */}
        <NavLink
          to="/trash"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaTrash /> <span>Lixeira</span>
        </NavLink>
      </nav>
    </aside>
  );
}