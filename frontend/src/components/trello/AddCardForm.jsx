import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

export default function AddCardForm({ listId, boardId, onCardCreated }) {
  const [isEditing, setIsEditing] = useState(false); // Controla se o formulário está visível
  const [cardTitle, setCardTitle] = useState('');
  const getToken = () => localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Usamos a API que já testámos no Postman
      await axios.post(
        'http://localhost:5000/api/cards',
        {
          title: cardTitle,
          listId: listId,
          boardId: boardId,
        },
        config
      );

      // Limpa o nome e fecha o formulário
      setCardTitle('');
      setIsEditing(false);
      // Avisa a 'BoardDetailPage' que um novo cartão foi criado
      onCardCreated();
    } catch (err) {
      console.error('Falha ao criar o cartão', err);
    }
  };

  // Se não estiver a editar, mostra o botão "Adicionar"
  if (!isEditing) {
    return (
      <button
        className="add-card-button"
        onClick={() => setIsEditing(true)}
      >
        + Adicionar um cartão
      </button>
    );
  }

  // Se estiver a editar, mostra o formulário
  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <textarea
        className="add-card-textarea"
        placeholder="Insira um título para este cartão..."
        value={cardTitle}
        onChange={(e) => setCardTitle(e.target.value)}
        autoFocus
      />
      <div className="add-list-controls"> {/* Reutilizamos este estilo */}
        <button type="submit" className="button-primary">
          Adicionar Cartão
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