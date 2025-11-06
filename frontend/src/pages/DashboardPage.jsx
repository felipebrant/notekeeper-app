import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import Header from '../components/Header';
import Note from '../components/Note';
import CreateNoteModal from '../components/CreateNoteModal';
import TagManagerModal from '../components/TagManagerModal';

export default function DashboardPage({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados dos Modais
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const getToken = () => localStorage.getItem('token');

  // Função para buscar todas as notas e marcadores
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Buscar notas e marcadores em paralelo
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

  // Buscar os dados quando a página carregar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FUNÇÃO PARA GUARDAR (CRIAR ou EDITAR) NOTA ---
  const handleSaveNote = async (noteData) => {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    };
    try {
      if (noteToEdit) {
        // --- Lógica de EDITAR ---
        const { data: updatedNote } = await axios.put(
          `http://localhost:5000/api/notes/${noteToEdit._id}`,
          noteData,
          config
        );
        setNotes(
          notes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
        );
      } else {
        // --- Lógica de CRIAR ---
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

  // --- FUNÇÃO PARA MOVER PARA A LIXEIRA (CORREÇÃO) ---
  const handleDeleteNote = async (id) => {
    if (!window.confirm('Mover esta nota para a lixeira?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(`http://localhost:5000/api/notes/${id}`, config);
      // Remove a nota da lista no ecrã
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      setError('Falha ao mover para a lixeira.');
      console.error(err);
    }
  };

  // --- FUNÇÃO PARA FIXAR NOTA (CORREÇÃO) ---
  const handlePinNote = async (id) => {
    const noteToPin = notes.find((n) => n._id === id);
    if (!noteToPin) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Atualiza o estado 'isPinned'
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

  // Lógica para abrir os modais
  const openCreateModal = () => {
    setNoteToEdit(null);
    setIsNoteModalOpen(true);
  };
  const openEditModal = (note) => {
    setNoteToEdit(note);
    setIsNoteModalOpen(true);
  };

  // Ordena as notas: fixadas primeiro, depois as mais recentes
  const sortedNotes = [...notes].sort(
    (a, b) => b.isPinned - a.isPinned || new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="dashboard-page">
      <Header
        user={user}
        onLogout={onLogout}
        onOpenTagManager={() => setIsTagModalOpen(true)}
      />
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
    </div>
  );
}