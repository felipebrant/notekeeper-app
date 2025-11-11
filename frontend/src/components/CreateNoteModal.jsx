import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
// Importamos o FaTimes (X) para o novo botão
import { FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';

// Copiamos a mesma função de contraste
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
  const [imageUrl, setImageUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setColor(noteToEdit.color || NOTE_COLORS[0]);
      setSelectedTags(noteToEdit.tags || []);
      setImageUrl(noteToEdit.imageUrl || '');
    } else {
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0]);
      setSelectedTags([]);
      setImageUrl('');
    }
    setUploadError('');
    setUploading(false);
    setFileName('');
  }, [noteToEdit, isOpen]);

  const handleToggleTag = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setUploadError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        config
      );

      setImageUrl(data.imagePath);
      setUploading(false);

    } catch (err) {
      console.error(err);
      setUploadError('Falha no upload. Apenas imagens (jpg, png) são permitidas.');
      setUploading(false);
      setFileName('');
    }
  };

  // --- NOVA FUNÇÃO PARA REMOVER A IMAGEM ---
  const handleRemoveImage = () => {
    setImageUrl(''); // Limpa o URL da imagem
    setFileName(''); // Limpa o nome do ficheiro
    // Limpa o input de ficheiro (truque para permitir re-upload do mesmo ficheiro)
    document.getElementById('file-upload').value = null; 
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSaveNote({
      title,
      content,
      color,
      tags: selectedTags,
      imageUrl,
    });
    onRequestClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel={noteToEdit ? 'Editar Nota' : 'Criar Nova Nota'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <div className="modal-header">
          <h2>{noteToEdit ? 'Editar Nota' : 'Criar Nova Nota'}</h2>
          <button onClick={onRequestClose} type="button" className="modal-close-button">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body-scrollable">
          
          <label htmlFor="file-upload" className="modal-file-upload-button">
            <FaUpload />
            <span>{fileName || 'Anexar Imagem (opcional)'}</span>
          </label>
          <input
            type="file"
            id="file-upload"
            className="modal-file-input-hidden"
            onChange={handleFileUpload}
          />
          
          {uploading && <p style={{ fontSize: '0.9rem', color: '#1c7ed6' }}>A carregar imagem...</p>}
          {uploadError && <p className="login-error" style={{marginTop: '5px'}}>{uploadError}</p>}
          
          {/* --- MOSTRA O PREVIEW E O BOTÃO DE REMOVER --- */}
          {imageUrl && (
            <div className="modal-image-preview-container">
              <img 
                src={`http://localhost:5000${imageUrl}`} 
                alt="Preview" 
                className="modal-image-preview" 
              />
              <button
                type="button"
                className="modal-image-remove-button"
                title="Remover Imagem"
                onClick={handleRemoveImage}
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          <input
            type="text"
            placeholder="Título (opcional)"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: imageUrl ? 0 : '1rem' }}
          />
          <textarea
            placeholder="Escreva a sua nota..."
            className="modal-textarea"
            value={content}
            // --- CORRIGIDO O ERRO DE DIGITAÇÃO AQUI (era e.g) ---
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="tag-selector">
            <h4>Marcadores</h4>
            <div className="tag-selector-list">
              {tags.length > 0 ? (
                tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag._id);
                  const tagColor = tag.color || '#FFFFFF';
                  const textColor = getContrastColor(tagColor);
                  
                  return (
                    <div
                      key={tag._id}
                      className={`tag-selector-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleTag(tag._id)}
                      style={{
                        backgroundColor: isSelected ? tagColor : 'var(--color-bg-primary)',
                        borderColor: tagColor,
                        color: isSelected ? textColor : 'var(--color-text-primary)',
                      }}
                    >
                      {tag.name}
                    </div>
                  );
                })
              ) : (
                // --- CORRIGIDO O ERRO DE DIGITAÇÃO AQUI (era /MP) ---
                <p style={{ fontSize: '0.9rem', color: '#868e96' }}>
                  Nenhum marcador criado.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
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
          <div className="modal-button-group">
            <button
              type="button"
              className="button-secondary"
              onClick={onRequestClose}
            >
              Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={uploading}>
              {uploading ? 'A carregar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}