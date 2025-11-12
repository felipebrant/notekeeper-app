import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
// 1. Importamos os novos ícones
import { FaPen, FaTrash } from 'react-icons/fa';

// 2. Agora recebemos 'onEdit' e 'onDelete'
export default function BoardCard({ card, index, onCardClick, onEdit, onDelete }) {
  
  // 3. Funções para parar o "click" de borbulhar
  // Se não fizermos isto, ao clicar em "Editar", o modal de "Visualizar" também abriria!
  const handleEditClick = (e) => {
    e.stopPropagation(); // Para o click de ir para o 'pai'
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`column-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onCardClick} // O click normal abre o 'ViewNoteModal'
        >
          {/* Botões de ação que aparecem no hover */}
          <div className="card-action-buttons">
            <button
              className="card-action-button"
              onClick={handleEditClick}
              title="Editar Cartão"
            >
              <FaPen />
            </button>
            <button
              className="card-action-button"
              onClick={handleDeleteClick}
              title="Mover para a Lixeira"
            >
              <FaTrash />
            </button>
          </div>

          {card.imageUrl && (
            <img
              src={`http://localhost:5000${card.imageUrl}`}
              alt={card.title}
              className="card-image-preview"
            />
          )}
          
          <p>{card.title}</p>
        </div>
      )}
    </Draggable>
  );
}