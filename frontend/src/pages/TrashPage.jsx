import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Note from '../components/Note';

export default function TrashPage({ user, onLogout }) {
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  // Função para buscar as notas na lixeira no backend
  const fetchTrashedNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.get(
        'http://localhost:5000/api/notes/trash',
        config
      );
      setTrashedNotes(data);
      setError('');
    } catch (err) {
      setError('Falha ao carregar as notas da lixeira.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  // Função para restaurar uma nota
  const handleRestoreNote = async (id) => {
    if (!window.confirm('Tem a certeza que quer restaurar esta nota?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.post(
        `http://localhost:5000/api/notes/${id}/restore`,
        {}, // Envia um corpo vazio, pois o ID está na URL
        config
      );
      // Remove a nota da lista da lixeira
      setTrashedNotes(trashedNotes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Falha ao restaurar a nota.');
      console.error(err);
    }
  };

  // Função para apagar permanentemente
  const handleDeletePermanent = async (id) => {
    if (
      !window.confirm(
        'Tem a certeza? Esta ação é PERMANENTE e não pode ser desfeita.'
      )
    )
      return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/notes/${id}/permanent`,
        config
      );
      // Remove a nota da lista da lixeira
      setTrashedNotes(trashedNotes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Falha ao apagar a nota permanentemente.');
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Header user={user} onLogout={onLogout} />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Lixeira</h2>
        <p className="dashboard-subtitle">
          Notas apagadas são mantidas aqui.
        </p>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <p>A carregar notas da lixeira...</p>
        ) : (
          <div className="notes-grid">
            {trashedNotes.length > 0 ? (
              trashedNotes.map((note) => (
                <Note
                  key={note._id}
                  note={note}
                  // Passamos as novas funções para os botões
                  onRestoreNote={() => handleRestoreNote(note._id)}
                  onDeletePermanent={() => handleDeletePermanent(note._id)}
                />
              ))
            ) : (
              <p>A sua lixeira está vazia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}