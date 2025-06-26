    import React, { useState } from 'react';
    import Modal from 'react-modal';
    import { FaTrash } from "react-icons/fa";

    Modal.setAppElement('#root');

    const tagColors = ['#FFFFFF', '#F28B82', '#FBBC04', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA'];

    function TagManagerModal({ isOpen, onClose, tags, onAddTag, onDeleteTag }) {
      const [newTagName, setNewTagName] = useState('');
      const [newTagColor, setNewTagColor] = useState(tagColors[0]);

      const handleAddTag = () => {
        if (newTagName.trim() === '') return;
        onAddTag({ name: newTagName, color: newTagColor });
        setNewTagName('');
        setNewTagColor(tagColors[0]);
      };
      
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          handleAddTag();
        }
      };

      return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>Gerir Marcadores</h2>
          
          <ul className="tag-manager-list">
            {tags.length > 0 ? tags.map(tag => (
              <li key={tag._id} className="tag-manager-item">
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: tag.color }}></div>
                  {tag.name}
                </span>
                <button className="note-button delete-button" onClick={() => onDeleteTag(tag._id)}>
                  <FaTrash />
                </button>
              </li>
            )) : <p>Ainda não tem marcadores.</p>}
          </ul>
          
          <input
            type="text"
            placeholder="Adicionar novo marcador..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{marginTop: '1.5rem'}}
          />

          <div className="modal-actions">
            <div className="color-picker">
              {tagColors.map(c => (
                <div 
                  key={c}
                  className={`color-dot ${newTagColor === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNewTagColor(c)}
                />
              ))}
            </div>
            <div className="modal-button-group">
              <button className="modal-button cancel-button" onClick={onClose}>Fechar</button>
              <button className="modal-button save-button" onClick={handleAddTag}>Adicionar</button>
            </div>
          </div>
        </Modal>
      );
    }

    export default TagManagerModal;
    