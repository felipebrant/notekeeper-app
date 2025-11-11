import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
// Removido 'Header'
import Note from '../components/Note';
import CreateNoteModal from '../components/CreateNoteModal';
import TagManagerModal from '../components/TagManagerModal';
import ViewNoteModal from '../components/ViewNoteModal';

// Recebe as props 'isTagModalOpen' e 'setIsTagModalOpen' do App.jsx
export default function DashboardPage({
  user,
  isTagModalOpen,
  setIsTagModalOpen,
}) {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados dos Modais
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [noteToView, setNoteToView] = useState(null);

  const getToken = () => localStorage.getItem('token');

  // Função para buscar dados (sem alterações)
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const [notesRes, tagsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/notes', config),
        axios.get('http://localhost:5000/api/tags', config),
      ]);
      setNotes(notesRes.data);
      setTags(tagsRes.data);
      setError('');
    } catch (err) {
      setError('Falha ao carregar os dados.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funções de guardar, apagar, fixar notas (sem alterações)
  const handleSaveNote = async (noteData) => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    };
    try {
      if (noteToEdit) {
        const { data: updatedNote } = await axios.put(
          `http://localhost:5000/api/notes/${noteToEdit._id}`,
          noteData,
          config
        );
        setNotes(
          notes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
        );
      } else {
        const { data: newNote } = await axios.post(
          'http://localhost:5000/api/notes',
          noteData,
          config
        );
        setNotes([newNote, ...notes]);
      }
      setNoteToEdit(null);
    } catch (err) {
      setError('Falha ao guardar a nota.');
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Mover esta nota para a lixeira?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(`http://localhost:5000/api/notes/${id}`, config);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      setError('Falha ao mover para a lixeira.');
      console.error(err);
    }
  };

  const handlePinNote = async (id) => {
    const noteToPin = notes.find((n) => n._id === id);
    if (!noteToPin) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data: updatedNote } = await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { isPinned: !noteToPin.isPinned },
        config
      );
      setNotes(
        notes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
      );
    } catch (err) {
      setError('Falha ao fixar a nota.');
      console.error(err);
    }
  };

  // Funções para abrir os modais (sem alterações)
  const openCreateModal = () => {
    setNoteToEdit(null);
    setIsNoteModalOpen(true);
  };
  const openEditModal = (note) => {
    setNoteToEdit(note);
    setIsNoteModalOpen(true);
  };
  const handleViewNote = (note) => {
    setNoteToView(note);
    setIsViewModalOpen(true);
  };

  // Ordenar notas (sem alterações)
  const sortedNotes = [...notes].sort(
    (a, b) => b.isPinned - a.isPinned || new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    // O <Header> foi removido daqui
    <div className="dashboard-page"> 
      <main className="dashboard-container">
        {error && <p className="login-error">{error}</p>}
        {isLoading ? (
          <p>A carregar notas...</p>
        ) : (
          <>
            <div className="notes-grid">
              {sortedNotes.length > 0 ? (
                sortedNotes.map((note) => (
                  <Note
                    key={note._id}
                    note={note}
                    tags={tags}
                    onView={() => handleViewNote(note)}
                    onEdit={() => openEditModal(note)}
                    onDelete={() => handleDeleteNote(note._id)}
                    onPin={() => handlePinNote(note._id)}
                  />
                ))
              ) : (
                <p>Nenhuma nota criada. Comece por adicionar uma!</p>
              )}
            </div>
          </>
        )}
      </main>

      <button className="fab" onClick={openCreateModal}>
        <FaPlus />
      </button>

      {/* Os Modais continuam a ser renderizados aqui */}
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onRequestClose={() => setIsNoteModalOpen(false)}
        onSaveNote={handleSaveNote}
        noteToEdit={noteToEdit}
        tags={tags}
      />
      
      <TagManagerModal
        isOpen={isTagModalOpen}
        onRequestClose={() => setIsTagModalOpen(false)}
      />

      <ViewNoteModal
        isOpen={isViewModalOpen}
        onRequestClose={() => setIsViewModalOpen(false)}
        note={noteToView}
        tags={tags}
      />
    </div>
  );
}