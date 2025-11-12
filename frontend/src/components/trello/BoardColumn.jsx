import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import BoardCard from './BoardCard';
import AddCardForm from './AddCardForm';
import { FaPen, FaTrash } from 'react-icons/fa';

export default function BoardColumn({
  list,
  cards,
  index,
  boardId,
  onCardCreated,
  onCardClick,
  onEditCard,
  onDeleteCard,
  onEditList,
  onDeleteList,
}) {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div
          className="board-column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {/* --- CORREÇÃO DO CABEÇALHO DA COLUNA --- */}
          {/* O 'dragHandleProps' (alça para arrastar)
              está agora num 'h3' separado */}
          <div className="column-header">
            <h3
              className="column-title"
              // Passamos a 'alça' para aqui
              {...provided.dragHandleProps} 
            >
              {list.name}
            </h3>
            
            <div className="column-header-actions">
              <button
                className="column-action-button"
                title="Renomear Lista"
                // O 'onClick' agora funciona porque não está a competir
                // com a 'alça' de arrastar
                onClick={onEditList}
              >
                <FaPen />
              </button>
              <button
                className="column-action-button"
                title="Apagar Lista"
                onClick={onDeleteList}
              >
                <FaTrash />
              </button>
            </div>
          </div>
          {/* --- FIM DA CORREÇÃO --- */}
          
          <Droppable droppableId={list._id} type="card">
            {(provided, snapshot) => (
              <div
                className={`column-card-list ${
                  snapshot.isDraggingOver ? 'dragging-over' : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {cards.map((card, cardIndex) => (
                  <BoardCard
                    key={card._id}
                    card={card}
                    index={cardIndex}
                    onCardClick={() => onCardClick(card)}
                    onEdit={() => onEditCard(card)}
                    onDelete={() => onDeleteCard(card._id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          
          <AddCardForm
            listId={list._id}
            boardId={boardId}
            onCardCreated={onCardCreated}
          />
        </div>
      )}
    </Draggable>
  );
}