import React from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import TagPill from './TagPill';

ReactModal.setAppElement('#root');

export default function ViewNoteModal({ isOpen, onRequestClose, note, tags }) {
  // Se a nota não estiver carregada, não mostra nada
  if (!note) return null;

  // Encontra os objectos completos dos marcadores desta nota
  const noteTags =
    note.tags && tags
      ? note.tags.map((tagId) => tags.find((t) => t._id === tagId)).filter(Boolean)
      : [];

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal view-modal" // Adicionámos uma classe 'view-modal'
      overlayClassName="modal-overlay"
      contentLabel="Visualizar Nota"
    >
      <div className="modal-header">
        {/* Mostra o título ou 'Sem Título' */}
        <h2>{note.title || 'Sem Título'}</h2>
        <button onClick={onRequestClose} className="modal-close-button">
          <FaTimes />
        </button>
      </div>

      <div className="modal-body modal-body-scrollable">
        {/* 1. MOSTRA A IMAGEM COMPLETA, SEM CORTES */}
        {note.imageUrl && (
          <img
            src={`http://localhost:5000${note.imageUrl}`}
            alt={note.title || 'Imagem da nota'}
            className="view-modal-image" // Estilo para a imagem completa
          />
        )}

        {/* 2. MOSTRA O CONTEÚDO */}
        <p className="view-modal-content">{note.content}</p>

        {/* 3. MOSTRA OS MARCADORES */}
        <div className="note-tags" style={{ marginTop: '1.5rem' }}>
          {noteTags.map((tag) => (
            <TagPill key={tag._id} tag={tag} />
          ))}
        </div>
      </div>

      {/* 4. RODAPÉ APENAS COM O BOTÃO DE FECHAR */}
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