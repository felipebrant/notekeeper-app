import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// As 8 cores que definimos
const NOTE_COLORS = [
  '#FFFFFF',
  '#F28B82',
  '#FBBC04',
  '#FFF475',
  '#CCFF90',
  '#A7FFEB',
  '#CBF0F8',
  '#AECBFA',
];

ReactModal.setAppElement('#root');

export default function CreateNoteModal({
  isOpen,
  onRequestClose,
  onSaveNote,
  noteToEdit,
  tags,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Se estivermos a editar uma nota, preenchemos os campos
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setColor(noteToEdit.color || NOTE_COLORS[0]);
      setSelectedTags(noteToEdit.tags || []);
    } else {
      // Se for para criar uma nova, limpamos tudo
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0]);
      setSelectedTags([]);
    }
  }, [noteToEdit, isOpen]);

  const handleToggleTag = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return; // Conteúdo é obrigatório

    onSaveNote({
      title,
      content,
      color,
      tags: selectedTags,
    });
    onRequestClose(); // Fecha o modal após guardar
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal" // <- Estilo principal do modal
      overlayClassName="modal-overlay" // <- Estilo do fundo
      contentLabel={noteToEdit ? 'Editar Nota' : 'Criar Nova Nota'}
    >
      <div className="modal-header">
        <h2>{noteToEdit ? 'Editar Nota' : 'Criar Nova Nota'}</h2>
        <button onClick={onRequestClose} className="modal-close-button">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="modal-body">
        <input
          type="text"
          placeholder="Título (opcional)"
          className="modal-input" // <- Estilo do campo de texto
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Escreva a sua nota..."
          className="modal-textarea" // <- Estilo da área de texto
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Seletor de Marcadores */}
        <div className="tag-selector">
          <h4>Marcadores</h4>
          <div className="tag-selector-list">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag._id}
                  className={`tag-selector-item ${
                    selectedTags.includes(tag._id) ? 'selected' : ''
                  }`}
                  onClick={() => handleToggleTag(tag._id)}
                  style={{
                    backgroundColor: selectedTags.includes(tag._id)
                      ? tag.color
                      : '#fff',
                    borderColor: tag.color,
                  }}
                >
                  {tag.name}
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#868e96' }}>
                Nenhum marcador criado.
              </p>
            )}
          </div>
        </div>

        <div className="modal-actions">
          {/* Seletor de Cores */}
          <div className="color-picker">
            {NOTE_COLORS.map((c) => (
              <div
                key={c}
                className={`color-dot ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          {/* Botões */}
          <div className="modal-button-group">
            <button
              type="button"
              className="button-secondary"
              onClick={onRequestClose}
            >
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Guardar
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}