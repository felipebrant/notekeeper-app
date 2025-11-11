import React from 'react';
import TagPill from './TagPill';
import {
  FaPen,
  FaTrash,
  FaThumbtack,
  FaUndo,
  FaTrashAlt,
  FaEye, // 1. IMPORTAMOS O ÍCONE DO "OLHINHO"
} from 'react-icons/fa';

export default function Note({
  note,
  tags,
  onEdit,
  onDelete,
  onPin,
  onRestoreNote,
  onDeletePermanent,
  onView, // 2. RECEBEMOS A NOVA FUNÇÃO 'onView'
}) {
  const isTrashPage = onRestoreNote && onDeletePermanent;

  const noteTags =
    note.tags && tags
      ? note.tags.map((tagId) => tags.find((t) => t._id === tagId)).filter(Boolean)
      : [];

  return (
    <div
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      style={{ borderTopColor: note.color }}
    >
      {/* 3. A IMAGEM FOI REMOVIDA DESTA VISTA PRINCIPAL */}
      
      {note.title && <h3 className="note-title">{note.title}</h3>}
      
      {/* Mostra apenas um preview do conteúdo para manter os cartões pequenos */}
      <p className="note-content">
        {note.content.substring(0, 150)}
        {note.content.length > 150 ? '...' : ''}
      </p>

      <div className="note-tags">
        {noteTags.map((tag) => (
          <TagPill key={tag._id} tag={tag} />
        ))}
      </div>

      <div className="note-actions">
        <div className="note-button-group">
          {isTrashPage ? (
            // Botões da Lixeira
            <>
              <button
                className="note-action-button"
                title="Restaurar Nota"
                onClick={onRestoreNote}
              >
                <FaUndo />
              </button>
              <button
                className="note-action-button"
                title="Apagar Permanentemente"
                onClick={onDeletePermanent}
              >
                <FaTrashAlt />
              </button>
            </>
          ) : (
            // Botões Normais do Dashboard
            <>
              {/* 4. ADICIONÁMOS O NOVO BOTÃO DE VISUALIZAR */}
              <button
                className="note-action-button"
                title="Visualizar Nota"
                onClick={onView} // 5. LIGÁMOS A FUNÇÃO
              >
                <FaEye />
              </button>
              <button
                className={`note-action-button ${
                  note.isPinned ? 'pinned-active' : ''
                }`}
                title="Fixar Nota"
                onClick={onPin}
              >
                <FaThumbtack />
              </button>
              <button
                className="note-action-button"
                title="Editar Nota"
                onClick={onEdit}
              >
                <FaPen />
              </button>
              <button
                className="note-action-button"
                title="Mover para a Lixeira"
                onClick={onDelete}
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}