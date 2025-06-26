    import React, { useState, useEffect } from 'react';
    import Modal from 'react-modal';
    
    Modal.setAppElement('#root');
    const noteColors = ['#FFFFFF', '#F28B82', '#FBBC04', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA'];

    function CreateNoteModal({ isOpen, onClose, onSave, noteToEdit, allTags }) {
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');
      const [color, setColor] = useState(noteColors[0]);
      const [selectedTags, setSelectedTags] = useState([]); // Estado para os marcadores selecionados

      useEffect(() => {
        if (noteToEdit) {
          setTitle(noteToEdit.title || '');
          setContent(noteToEdit.content || '');
          setColor(noteToEdit.color || noteColors[0]);
          // Pré-seleciona os marcadores da nota a ser editada
          setSelectedTags(noteToEdit.tags ? noteToEdit.tags.map(t => t._id) : []);
        } else {
          setTitle('');
          setContent('');
          setColor(noteColors[0]);
          setSelectedTags([]);
        }
      }, [noteToEdit, isOpen]);
      
      const handleTagClick = (tagId) => {
        // Adiciona ou remove o ID do marcador da lista de selecionados
        setSelectedTags(prev => 
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
      };

      const handleSave = () => {
        const noteData = { title, content, color, tags: selectedTags }; // Inclui os IDs dos marcadores
        if (noteToEdit) {
          noteData._id = noteToEdit._id;
        }
        onSave(noteData);
      };

      return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>{noteToEdit ? 'Editar Nota' : 'Criar Nova Nota'}</h2>
          <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="Criar uma nota..." value={content} onChange={(e) => setContent(e.target.value)} />
          
          {/* Seletor de Marcadores */}
          <div className="tag-selector">
              <h4>Marcadores</h4>
              <div className="tag-selector-list">
                  {allTags.map(tag => (
                      <div 
                        key={tag._id}
                        className={`tag-selector-item ${selectedTags.includes(tag._id) ? 'selected' : ''}`}
                        onClick={() => handleTagClick(tag._id)}
                      >
                          {tag.name}
                      </div>
                  ))}
              </div>
          </div>

          <div className="modal-actions">
            <div className="color-picker">
              {noteColors.map(c => ( <div key={c} className={`color-dot ${color === c ? 'selected' : ''}`} style={{ backgroundColor: c }} onClick={() => setColor(c)} /> ))}
            </div>
            <div className="modal-button-group">
              <button className="modal-button cancel-button" onClick={onClose}>Cancelar</button>
              <button className="modal-button save-button" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </Modal>
      );
    }

    export default CreateNoteModal;
    