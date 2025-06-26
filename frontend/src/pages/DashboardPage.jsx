    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { FaPlus } from 'react-icons/fa';

    import Header from '../components/Header';
    import Note from '../components/Note';
    import CreateNoteModal from '../components/CreateNoteModal';
    import TagManagerModal from '../components/TagManagerModal';

    function DashboardPage({ user, onLogout }) {
      const [notes, setNotes] = useState([]);
      const [tags, setTags] = useState([]);
      const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
      const [isTagModalOpen, setIsTagModalOpen] = useState(false);
      const [noteToEdit, setNoteToEdit] = useState(null);

      // --- Funções de API ---
      const authConfig = { headers: { Authorization: `Bearer ${user.token}` } };
      const authConfigJson = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
      
      const fetchNotes = async () => {
        const { data } = await axios.get('http://localhost:5000/api/notes', authConfig);
        setNotes(data.sort((a, b) => b.isPinned - a.isPinned || new Date(b.createdAt) - new Date(a.createdAt)));
      };
      
      const fetchTags = async () => {
        const { data } = await axios.get('http://localhost:5000/api/tags', authConfig);
        setTags(data);
      };

      useEffect(() => {
        fetchNotes();
        fetchTags();
      }, []);

      // --- Lógica das Notas ---
      const handleSaveNote = async (noteData) => {
        if (noteData._id) {
          await axios.put(`http://localhost:5000/api/notes/${noteData._id}`, noteData, authConfigJson);
        } else {
          await axios.post('http://localhost:5000/api/notes', noteData, authConfigJson);
        }
        fetchNotes();
        setIsNoteModalOpen(false);
      };

      const handleDeleteNote = async (id) => {
        if (window.confirm('Tem a certeza?')) {
            await axios.delete(`http://localhost:5000/api/notes/${id}`, authConfig);
            setNotes(prevNotes => prevNotes.filter(noteItem => noteItem._id !== id));
        }
      };
      
      const handlePinNote = async (note) => {
        await axios.put(`http://localhost:5000/api/notes/${note._id}`, { isPinned: !note.isPinned }, authConfigJson);
        fetchNotes();
      };
      
      // --- Lógica dos Marcadores ---
      const handleAddTag = async (tagData) => {
          await axios.post('http://localhost:5000/api/tags', tagData, authConfigJson);
          fetchTags();
      };

      const handleDeleteTag = async (id) => {
          if (window.confirm('Apagar este marcador irá removê-lo de todas as notas. Tem a certeza?')) {
              await axios.delete(`http://localhost:5000/api/tags/${id}`, authConfig);
              fetchTags(); 
              fetchNotes(); 
          }
      };

      return (
        <div>
          <Header user={user} onLogout={onLogout} onOpenTagManager={() => setIsTagModalOpen(true)} />
          
          <div className="notes-container">
            <div className="notes-grid">
              {notes.map((noteItem) => (
                <Note
                  key={noteItem._id}
                  note={noteItem}
                  onDelete={handleDeleteNote}
                  onEdit={(note) => { setNoteToEdit(note); setIsNoteModalOpen(true); }}
                  onPin={handlePinNote}
                />
              ))}
            </div>
          </div>

          <button className="fab" onClick={() => { setNoteToEdit(null); setIsNoteModalOpen(true); }}>
            <FaPlus />
          </button>
          
          <CreateNoteModal
            isOpen={isNoteModalOpen}
            onClose={() => setIsNoteModalOpen(false)}
            onSave={handleSaveNote}
            noteToEdit={noteToEdit}
            allTags={tags}
          />

          <TagManagerModal 
            isOpen={isTagModalOpen}
            onClose={() => setIsTagModalOpen(false)}
            tags={tags}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
          />
        </div>
      );
    }

    export default DashboardPage;
    