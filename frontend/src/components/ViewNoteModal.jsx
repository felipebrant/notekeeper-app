import React from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import TagPill from './TagPill';
// 1. Importamos o nosso novo componente de comentários
import CommentSection from './trello/CommentSection';

ReactModal.setAppElement('#root');

// 2. Agora o modal também recebe 'user' e 'boardId' (para os comentários)
export default function ViewNoteModal({ isOpen, onRequestClose, note, tags, user, boardId }) {
  // Se a nota (ou cartão) não estiver carregada, não mostra nada
  if (!note) return null;

  // Encontra os objectos completos dos marcadores
  const noteTags =
    note.tags && tags
      ? note.tags.map((tagId) => tags.find((t) => t._id === tagId)).filter(Boolean)
      : [];

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal view-modal"
      overlayClassName="modal-overlay"
      contentLabel="Visualizar Detalhes"
    >
      <div className="modal-header">
        <h2>{note.title || 'Sem Título'}</h2>
        <button onClick={onRequestClose} className="modal-close-button">
          <FaTimes />
        </button>
      </div>

      <div className="modal-body-scrollable">
        {/* Imagem */}
        {note.imageUrl && (
          <img
            src={`http://localhost:5000${note.imageUrl}`}
            alt={note.title || 'Imagem da nota'}
            className="view-modal-image"
          />
        )}

        {/* Conteúdo */}
        <p className="view-modal-content">{note.content || '(Sem descrição)'}</p>

        {/* Marcadores */}
        <div className="note-tags" style={{ marginTop: '1.5rem' }}>
          {noteTags.map((tag) => (
            <TagPill key={tag._id} tag={tag} />
          ))}
        </div>

        {/* 3. ADICIONAMOS A NOVA SECÇÃO DE COMENTÁRIOS */}
        {/* Isto só aparece se for um "Cartão" (que tem um boardId) */}
        {boardId && (
          <CommentSection card={note} boardId={boardId} user={user} />
        )}

      </div>

      {/* Rodapé com botão de fechar */}
      <div className="modal-actions">
        <div className="modal-button-group">
          <button
            type="button"
            className="button-secondary"
            onClick={onRequestClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </ReactModal>
  );
}