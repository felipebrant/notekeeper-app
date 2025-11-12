import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

export default function AddListForm({ boardId, onListCreated }) {
  const [isEditing, setIsEditing] = useState(false); // Controla se o formulário está visível
  const [listName, setListName] = useState('');
  const getToken = () => localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listName.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Usamos a API que já testámos no Postman
      await axios.post(
        'http://localhost:5000/api/lists',
        {
          name: listName,
          boardId: boardId,
        },
        config
      );

      // Limpa o nome e fecha o formulário
      setListName('');
      setIsEditing(false);
      // Avisa a 'BoardDetailPage' que uma nova lista foi criada,
      // para que ela possa recarregar os dados
      onListCreated();
    } catch (err) {
      console.error('Falha ao criar a lista', err);
      // (Poderíamos adicionar uma mensagem de erro aqui)
    }
  };

  // Se não estiver a editar, mostra o botão "Adicionar"
  if (!isEditing) {
    return (
      <button
        className="add-list-button"
        onClick={() => setIsEditing(true)}
      >
        + Adicionar outra lista
      </button>
    );
  }

  // Se estiver a editar, mostra o formulário
  return (
    <form onSubmit={handleSubmit} className="add-list-form">
      <input
        type="text"
        className="modal-input" // Reutilizamos o estilo de input
        placeholder="Insira o título da lista..."
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        autoFocus // Foca o campo automaticamente
      />
      <div className="add-list-controls">
        <button type="submit" className="button-primary">
          Adicionar Lista
        </button>
        <button
          type="button"
          className="modal-close-button"
          onClick={() => setIsEditing(false)}
        >
          <FaTimes />
        </button>
      </div>
    </form>
  );
}