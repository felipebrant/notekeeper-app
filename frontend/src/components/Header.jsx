    import React from 'react';
    import { FaLightbulb, FaTags } from 'react-icons/fa';

    function Header({ user, onLogout, onOpenTagManager }) {
      return (
        <header className="header">
          <h1>
            <FaLightbulb color="#f5ba13" />
            NoteKeeper
          </h1>
          <div className="header-user">
            {/* Botão para gerir marcadores */}
            <button className="note-button" title="Gerir Marcadores" onClick={onOpenTagManager}>
              <FaTags />
            </button>
            <span>Olá, {user.name}</span>
            <button className="logout-button" onClick={onLogout}>
              Sair
            </button>
          </div>
        </header>
      );
    }

    export default Header;
    