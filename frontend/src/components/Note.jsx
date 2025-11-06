import React from 'react';
import TagPill from './TagPill';
import {
  FaPen,
  FaTrash,
  FaThumbtack,
  FaUndo,
  FaTrashAlt,
} from 'react-icons/fa';

// Recebe os dados da nota e todas as funções do Dashboard/TrashPage
export default function Note({
  note,
  tags,
  onEdit,
  onDelete,
  onPin,
  onRestoreNote,
  onDeletePermanent,
}) {
  // Verifica se estamos na página da lixeira (se as props da lixeira existirem)
  const isTrashPage = onRestoreNote && onDeletePermanent;

  // Encontra os objectos completos dos marcadores desta nota
  const noteTags =
    note.tags && tags
      ? note.tags.map((tagId) => tags.find((t) => t._id === tagId)).filter(Boolean)
      : [];

  return (
    <div
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      style={{ borderTopColor: note.color }}
    >
      {/* Título da Nota */}
      {note.title && <h3 className="note-title">{note.title}</h3>}

      {/* Conteúdo da Nota */}
      <p className="note-content">{note.content}</p>

      {/* Marcadores (Tags) */}
      <div className="note-tags">
        {noteTags.map((tag) => (
          <TagPill key={tag._id} tag={tag} />
        ))}
      </div>

      {/* Botões de Ação */}
      <div className="note-actions">
        <div className="note-button-group">
          {/* Mostra botões diferentes dependendo da página */}
          {isTrashPage ? (
            // --- Botões da Lixeira ---
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
            // --- Botões Normais do Dashboard ---
            <>
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