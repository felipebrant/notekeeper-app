    import React from 'react';
    import { FaTrash, FaEdit, FaThumbtack } from 'react-icons/fa';
    import TagPill from './TagPill';

    function Note({ note, onDelete, onEdit, onPin }) {
      const noteClasses = `note ${note.isPinned ? 'pinned' : ''}`;
      const noteStyle = { borderTopColor: note.color };

      return (
        <div className={noteClasses} style={noteStyle}>
          <div>
            <h1>{note.title}</h1>
            {/* Mostra os marcadores da nota */}
            <div className="note-tags-container">
              {note.tags && note.tags.map(tag => (
                <TagPill key={tag._id} tag={tag} />
              ))}
            </div>
            <p>{note.content}</p>
          </div>
          
          <div className="note-actions">
            <button 
              className={`note-button pin-button ${note.isPinned ? 'pinned' : ''}`} 
              onClick={() => onPin(note)}
            >
              <FaThumbtack />
            </button>
            <div className="note-button-group">
              <button className="note-button edit-button" onClick={() => onEdit(note)}>
                <FaEdit />
              </button>
              <button className="note-button delete-button" onClick={() => onDelete(note._id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      );
    }

    export default Note;
    