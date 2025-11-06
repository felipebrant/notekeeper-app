import React, { useState } from 'react';
import { FaLightbulb, FaTag, FaTrash } from 'react-icons/fa'; // 1. Importar o FaTrash
import { Link } from 'react-router-dom'; // 2. Importar o Link
import TagManagerModal from './TagManagerModal';

export default function Header({ user, onLogout }) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-logo-link"> {/* 3. Link no logo */}
            <FaLightbulb className="header-icon" />
            <h1>NoteKeeper</h1>
          </Link>
          <div className="header-user-info">
            <span>Olá, {user.name}</span>
            {/* 4. Link para gerir marcadores */}
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="header-button tag-manager-button"
              title="Gerir Marcadores"
            >
              <FaTag />
            </button>
            {/* 5. NOVO BOTÃO PARA A LIXEIRA */}
            <Link
              to="/trash"
              className="header-button trash-button"
              title="Lixeira"
            >
              <FaTrash />
            </Link>
            <button onClick={onLogout} className="header-button logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>
      <TagManagerModal
        isOpen={isTagModalOpen}
        onRequestClose={() => setIsTagModalOpen(false)}
      />
    </>
  );
}