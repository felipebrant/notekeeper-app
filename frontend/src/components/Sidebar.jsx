import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaStickyNote, FaTrash, FaTags } from 'react-icons/fa';

// Recebe a função para abrir o modal de tags
export default function Sidebar({ onOpenTagManager }) {
  return (
    // O logo foi removido daqui
    <aside className="app-sidebar">
      {/* Links de Navegação */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaStickyNote /> <span>Notas</span>
        </NavLink>
        
        <button onClick={onOpenTagManager} className="sidebar-link-button">
          <FaTags /> <span>Editar Marcadores</span>
        </button>
        
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