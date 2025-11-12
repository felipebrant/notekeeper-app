import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';

ReactModal.setAppElement('#root');

// Este é o NOVO modal de edição, específico para Cartões
export default function CardEditModal({
  isOpen,
  onRequestClose,
  onSaveCard, // Recebe a função para guardar
  cardToEdit, // Recebe o cartão a editar
}) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');

  // Preenche os campos quando o 'cardToEdit' mudar
  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setImageUrl(cardToEdit.imageUrl || '');
      // Removemos 'content' e 'tags'
    } else {
      setTitle('');
      setImageUrl('');
    }
    setUploadError('');
    setUploading(false);
    setFileName('');
  }, [cardToEdit, isOpen]);

  const handleFileUpload = async (e) => {
    // (Lógica de upload de ficheiro ... sem alterações)
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

  const handleRemoveImage = () => {
    setImageUrl('');
    setFileName('');
    document.getElementById('card-file-upload').value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // O Título é obrigatório

    // Envia os dados para o 'onSaveCard'
    onSaveCard({
      title,
      imageUrl,
      // 'content' e 'tags' foram removidos
    });
    onRequestClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel="Editar Cartão"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <div className="modal-header">
          <h2>Editar Cartão</h2>
          <button onClick={onRequestClose} type="button" className="modal-close-button">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body-scrollable">
          
          <label htmlFor="card-file-upload" className="modal-file-upload-button">
            <FaUpload />
            <span>{fileName || 'Anexar Imagem (opcional)'}</span>
          </label>
          <input
            type="file"
            id="card-file-upload"
            className="modal-file-input-hidden"
            onChange={handleFileUpload}
          />
          
          {uploading && <p style={{ fontSize: '0.9rem', color: '#1c7ed6' }}>A carregar imagem...</p>}
          {uploadError && <p className="login-error" style={{marginTop: '5px'}}>{uploadError}</p>}
          
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
            placeholder="Título do cartão"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: imageUrl ? 0 : '1rem' }}
            required
          />
          
          {/* O 'textarea' de Descrição/Content foi REMOVIDO */}
          {/* A secção de 'Marcadores' (Tags) foi REMOVIDA */}

        </div>

        {/* --- RODAPÉ SIMPLIFICADO --- */}
        {/* A paleta de cores foi REMOVIDA */}
        <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
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