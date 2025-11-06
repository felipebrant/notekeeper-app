import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import { FaTrash, FaTimes } from 'react-icons/fa';
import TagPill from './TagPill';

// Lista de cores disponíveis para os marcadores
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

// Define o elemento raiz da aplicação para o modal (importante para acessibilidade)
ReactModal.setAppElement('#root');

export default function TagManagerModal({ isOpen, onRequestClose }) {
  // --- A CORREÇÃO ESTÁ AQUI ---
  // Iniciamos 'tags' como uma lista vazia ([]) em vez de null.
  const [tags, setTags] = useState([]);
  // -----------------------------

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  // Função para buscar os marcadores
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

  // Buscar os marcadores quando o modal for aberto
  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen, fetchTags]);

  // Função para criar um novo marcador
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return; // Não adiciona marcadores vazios

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data: newTag } = await axios.post(
        'http://localhost:5000/api/tags',
        { name: newTagName, color: newTagColor },
        config
      );
      setTags([...tags, newTag]); // Adiciona o novo marcador à lista
      setNewTagName(''); // Limpa o campo
      setNewTagColor(TAG_COLORS[0]); // Volta à cor padrão
    } catch (err) {
      setError('Falha ao adicionar o marcador.');
      console.error(err);
    }
  };

  // Função para apagar um marcador
  const handleDeleteTag = async (id) => {
    if (!window.confirm('Tem a certeza que quer apagar este marcador?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(`http://localhost:5000/api/tags/${id}`, config);
      setTags(tags.filter((tag) => tag._id !== id)); // Remove o marcador da lista
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
      <div className="modal-header">
        <h2>Gerir Marcadores</h2>
        <button onClick={onRequestClose} className="modal-close-button">
          <FaTimes />
        </button>
      </div>
      <div className="modal-body">
        {error && <div className="error-message">{error}</div>}

        {/* Lista de marcadores existentes */}
        <div className="tag-manager-list">
          {isLoading ? (
            <p>A carregar...</p>
          ) : (
            tags.length > 0 ? (
              tags.map((tag) => (
                <div key={tag._id} className="tag-manager-item">
                  <TagPill tag={tag} />
                  <button
                    onClick={() => handleDeleteTag(tag._id)}
                    className="tag-delete-button"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p>Nenhum marcador criado.</p>
            )
          )}
        </div>

        {/* Formulário para adicionar novo marcador */}
        <form onSubmit={handleAddTag} className="tag-manager-form">
          <input
            type="text"
            placeholder="Novo marcador..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="modal-input"
            maxLength={30}
          />

          {/* Seletor de Cores */}
          <div className="modal-color-selector tag-color-selector">
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

          <div className="modal-actions tag-manager-actions">
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
      </div>
    </ReactModal>
  );
}