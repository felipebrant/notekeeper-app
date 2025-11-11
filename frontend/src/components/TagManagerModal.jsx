import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import { FaTrash, FaTimes } from 'react-icons/fa';

// Função de contraste (para o texto das pílulas)
const getContrastColor = (hexcolor) => {
  if (!hexcolor || hexcolor === '#FFFFFF') {
    return '#343a40';
  }
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#343a40' : '#FFFFFF';
};

// --- A PALETA DE 8 CORES QUE VOCÊ PEDIU ---
const TAG_COLORS = [
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

export default function TagManagerModal({ isOpen, onRequestClose }) {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data } = await axios.get(
        'http://localhost:5000/api/tags',
        config
      );
      setTags(data);
      setError('');
    } catch (err) {
      setError('Falha ao carregar os marcadores.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen, fetchTags]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data: newTag } = await axios.post(
        'http://localhost:5000/api/tags',
        { name: newTagName, color: newTagColor },
        config
      );
      setTags([...tags, newTag]);
      setNewTagName('');
      setNewTagColor(TAG_COLORS[0]);
    } catch (err) {
      setError('Falha ao adicionar o marcador.');
      console.error(err);
    }
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm('Tem a certeza que quer apagar este marcador?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(`http://localhost:5000/api/tags/${id}`, config);
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (err) {
      setError('Falha ao apagar o marcador.');
      console.error(err);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel="Gerir Marcadores"
    >
      <form onSubmit={handleAddTag} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* CABEÇALHO */}
        <div className="modal-header">
          <h2>Gerir Marcadores</h2>
          <button onClick={onRequestClose} type="button" className="modal-close-button">
            <FaTimes />
          </button>
        </div>

        {/* CORPO (COM SCROLL) */}
        <div className="modal-body-scrollable">
          {error && <div className="login-error" style={{marginBottom: '1rem'}}>{error}</div>}
          
          <div className="tag-manager-list">
            {isLoading ? (
              <p>A carregar...</p>
            ) : (
              tags.length > 0 ? (
                tags.map((tag) => {
                  const textColor = getContrastColor(tag.color);
                  return (
                    <div key={tag._id} className="tag-manager-item">
                      <div
                        className="tag-manager-tag"
                        style={{
                          backgroundColor: tag.color,
                          color: textColor,
                          border: tag.color === '#FFFFFF' ? '1px solid #e0e0e0' : 'none',
                        }}
                      >
                        {tag.name}
                      </div>
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        className="tag-delete-button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>Nenhum marcador criado.</p>
              )
            )}
          </div>

          {/* O formulário de criação foi movido para dentro do corpo */}
          <div className="tag-manager-form">
            <input
              type="text"
              placeholder="Novo marcador..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="modal-input"
              maxLength={30}
            />
          </div>
        </div>

        {/* RODAPÉ (FIXO) --- ESTA É A CORREÇÃO PRINCIPAL --- */}
        <div className="modal-actions">
          {/* O seletor de cores agora está DENTRO do rodapé */}
          <div className="color-picker">
            {TAG_COLORS.map((color) => (
              <div
                key={color}
                className={`color-dot ${
                  newTagColor === color ? 'selected' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTagColor(color)}
              />
            ))}
          </div>

          {/* O grupo de botões também está DENTRO do rodapé */}
          <div className="modal-button-group">
            <button
              type="button"
              className="button-secondary"
              onClick={onRequestClose}
            >
              Fechar
            </button>
            <button type="submit" className="button-primary">
              Adicionar
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}