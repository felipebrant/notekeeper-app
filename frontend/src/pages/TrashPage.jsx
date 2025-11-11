import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Removido 'Header'
import Note from '../components/Note';

// Recebe as props 'user' e 'onLogout' do 'App.jsx'
export default function TrashPage({ user, onLogout }) {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  // Função para buscar notas da lixeira
  const fetchTrashedNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Busca as notas da lixeira E os marcadores
      const [notesRes, tagsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/notes/trash', config),
        axios.get('http://localhost:5000/api/tags', config),
      ]);
      setTrashedNotes(notesRes.data);
      setTags(tagsRes.data);
      setError('');
    } catch (err) {
      setError('Falha ao carregar a lixeira.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  // Função para restaurar a nota
  const handleRestoreNote = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.put(
        `http://localhost:5000/api/notes/${id}/restore`,
        {},
        config
      );
      // Remove a nota da lista da lixeira
      setTrashedNotes(trashedNotes.filter((n) => n._id !== id));
    } catch (err) {
      setError('Falha ao restaurar a nota.');
      console.error(err);
    }
  };

  // Função para apagar permanentemente
  const handleDeletePermanent = async (id) => {
    if (!window.confirm('Apagar esta nota PERMANENTEMENTE? Esta ação não pode ser desfeita.')) 
      return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(
        `http://localhost:5000/api/notes/${id}/permanent`,
        config
      );
      // Remove a nota da lista
      setTrashedNotes(trashedNotes.filter((n) => n._id !== id));
    } catch (err) {
      setError('Falha ao apagar a nota permanentemente.');
      console.error(err);
    }
  };

  return (
    // O <Header> foi removido daqui
    <div className="dashboard-page">
      <main className="dashboard-container">
        <h2 className="dashboard-title">Lixeira</h2>
        <p className="dashboard-subtitle">
          Notas apagadas são mantidas aqui.
        </p>
        
        {error && <p className="login-error">{error}</p>}
        {isLoading ? (
          <p>A carregar lixeira...</p>
        ) : (
          <div className="notes-grid">
            {trashedNotes.length > 0 ? (
              trashedNotes.map((note) => (
                <Note
                  key={note._id}
                  note={note}
                  tags={tags}
                  // Passa as funções específicas da lixeira
                  onRestoreNote={() => handleRestoreNote(note._id)}
                  onDeletePermanent={() => handleDeletePermanent(note._id)}
                />
              ))
            ) : (
              <p>A sua lixeira está vazia.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}