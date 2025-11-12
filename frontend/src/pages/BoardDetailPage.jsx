import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
// 1. Importamos o novo ícone de partilha
import { FaUserPlus } from 'react-icons/fa';
import BoardColumn from '../components/trello/BoardColumn';
import AddListForm from '../components/trello/AddListForm';
import ViewNoteModal from '../components/ViewNoteModal';
import CardEditModal from '../components/trello/CardEditModal';
import RenameModal from '../components/RenameModal';
// 2. Importamos o nosso novo modal de partilha
import ShareModal from '../components/trello/ShareModal';

export default function BoardDetailPage({ user }) {
  const [boardData, setBoardData] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modais de Cartões
  const [viewingCard, setViewingCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isCardEditModalOpen, setIsCardEditModalOpen] = useState(false);
  
  // Modal de Lista
  const [isListRenameModalOpen, setIsListRenameModalOpen] = useState(false);
  const [listToRename, setListToRename] = useState(null);
  
  // 3. Novo estado para o modal de partilha
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const { boardId } = useParams();
  const navigate = useNavigate();
  const getToken = () => localStorage.getItem('token');

  // --- FUNÇÃO PARA BUSCAR OS DADOS (Sem alterações) ---
  const fetchBoardDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // A nossa API GET /api/boards/:id já nos traz os membros!
      const [boardRes, tagsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/boards/${boardId}`, config),
        axios.get('http://localhost:5000/api/tags', config),
      ]);
      setBoardData(boardRes.data);
      setTags(tagsRes.data);
      setError('');
    } catch (err) {
      if (err.response && (err.response.status === 404 || err.response.status === 401)) {
        // Se o quadro não for encontrado ou não formos membros,
        // manda-nos de volta para a lista de quadros
        setError('Quadro não encontrado ou acesso negado.');
        navigate('/boards');
      } else {
        setError('Falha ao carregar o quadro.');
      }
      console.error(err);
    }
    setIsLoading(false);
  }, [boardId, navigate]);

  useEffect(() => {
    fetchBoardDetails();
  }, [fetchBoardDetails]);

  // --- LÓGICA DO "ARRASTAR E LARGAR" (Sem alterações) ---
  const onDragEnd = async (result) => {
    // (Código de onDragEnd ... sem alterações)
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type !== 'card') return;
    const startList = boardData.lists.find(
      (list) => list._id === source.droppableId
    );
    const finishList = boardData.lists.find(
      (list) => list._id === destination.droppableId
    );
    const [movedCard] = startList.cards.splice(source.index, 1);
    let newLists;
    if (startList === finishList) {
      const newCards = Array.from(startList.cards);
      newCards.splice(destination.index, 0, movedCard);
      const newList = { ...startList, cards: newCards };
      newLists = boardData.lists.map((list) =>
        list._id === newList._id ? newList : list
      );
    } else {
      const finishCards = Array.from(finishList.cards);
      finishCards.splice(destination.index, 0, movedCard);
      const newStartList = { ...startList, cards: startList.cards };
      const newFinishList = { ...finishList, cards: finishCards };
      newLists = boardData.lists.map((list) => {
        if (list._id === newStartList._id) return newStartList;
        if (list._id === newFinishList._id) return newFinishList;
        return list;
      });
    }
    setBoardData({ ...boardData, lists: newLists });
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.put(
        `http://localhost:5000/api/cards/${draggableId}/move`,
        {
          newListId: destination.droppableId,
          newPosition: destination.index,
          oldListId: source.droppableId,
        },
        config
      );
    } catch (err) {
      setError('Falha ao salvar a posição do cartão. Por favor, atualize a página.');
      console.error(err);
      fetchBoardDetails(); 
    }
  };
  
  // --- FUNÇÕES DE GESTÃO DE CARTÕES (Sem alterações) ---
  const handleSaveCard = async (cardData) => {
    // (Código de handleSaveCard ... sem alterações)
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` },
    };
    try {
      if (editingCard) {
        await axios.put(
          `http://localhost:5000/api/cards/${editingCard._id}`,
          cardData,
          config
        );
        fetchBoardDetails();
      } 
      setIsCardEditModalOpen(false);
      setEditingCard(null);
    } catch (err) {
      setError('Falha ao guardar o cartão.');
      console.error(err);
    }
  };
  const handleDeleteCard = async (cardId) => {
    // (Código de handleDeleteCard ... sem alterações)
    if (!window.confirm('APAGAR PERMANENTEMENTE este cartão?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(
        `http://localhost:5000/api/cards/${cardId}`, 
        config
      );
      fetchBoardDetails();
    } catch (err) {
      setError('Falha ao apagar o cartão.');
      console.error(err);
    }
  };

  // --- FUNÇÕES DE GESTÃO DE LISTAS (Sem alterações) ---
  const handleUpdateList = async (newName) => {
    // (Código de handleUpdateList ... sem alterações)
    if (!newName || !newName.trim() || !listToRename || newName === listToRename.name) {
      setIsListRenameModalOpen(false);
      setListToRename(null);
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.put(
        `http://localhost:5000/api/lists/${listToRename._id}`,
        { name: newName },
        config
      );
      fetchBoardDetails();
      setIsListRenameModalOpen(false);
      setListToRename(null);
    } catch (err) {
      setError('Falha ao renomear a lista.');
      console.error(err);
    }
  };
  const handleDeleteList = async (listId) => {
    // (Código de handleDeleteList ... sem alterações)
    if (!window.confirm('APAGAR PERMANENTEMENTE esta lista e todos os seus cartões?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(
        `http://localhost:5000/api/lists/${listId}`,
        config
      );
      fetchBoardDetails();
    } catch (err) {
      setError('Falha ao apagar a lista.');
      console.error(err);
    }
  };

  // --- FUNÇÕES DE ABRIR MODAIS (Sem alterações) ---
  const openEditModal = (card) => {
    setEditingCard(card);
    setIsCardEditModalOpen(true);
  };
  const openViewModal = (card) => {
    setViewingCard(card);
  };
  const closeCardEditModal = () => {
    setIsCardEditModalOpen(false);
    setEditingCard(null);
  }
  const openRenameListModal = (list) => {
    setListToRename(list);
    setIsListRenameModalOpen(true);
  };


  // --- RENDERIZAÇÃO ---
  if (isLoading) return <p className="loading-message">A carregar quadro...</p>;
  if (error) return <p className="login-error" style={{padding: '2rem'}}>{error}</p>;
  if (!boardData) return <p style={{padding: '2rem'}}>Quadro não encontrado.</p>;

  // 4. Verificamos se o utilizador logado é o DONO do quadro
  const isOwner = boardData.owner._id === user._id;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-detail-page">
          <div className="board-detail-header">
            <h2 className="dashboard-title">{boardData.name}</h2>
            
            {/* 5. Mostramos os avatares dos membros */}
            <div className="board-members-list">
              {boardData.members.map(member => (
                <div key={member._id} className="member-avatar" title={member.name}>
                  {/* Pega na primeira letra do nome */}
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}

              {/* 6. Só o DONO pode ver o botão de partilhar */}
              {isOwner && (
                <button 
                  className="header-button" 
                  title="Partilhar Quadro"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <FaUserPlus />
                </button>
              )}
            </div>
          </div>
          
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                className="board-column-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {boardData.lists.map((list, index) => {
                  const cards = list.cards || []; 
                  return (
                    <BoardColumn
                      key={list._id}
                      list={list}
                      cards={cards}
                      index={index}
                      boardId={boardData._id}
                      onCardCreated={fetchBoardDetails}
                      onCardClick={(card) => openViewModal(card)}
                      onEditCard={(card) => openEditModal(card)}
                      onDeleteCard={(cardId) => handleDeleteCard(cardId)}
                      onEditList={() => openRenameListModal(list)}
                      onDeleteList={() => handleDeleteList(list._id)}
                    />
                  );
                })}
                {provided.placeholder}
                
                <AddListForm
                  boardId={boardData._id}
                  onListCreated={fetchBoardDetails}
                />
                
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Os nossos 3 tipos de modais */}
      <ViewNoteModal
        isOpen={!!viewingCard}
        onRequestClose={() => setViewingCard(null)}
        note={viewingCard}
        tags={tags}
        user={user}
        boardId={boardId}
      />
      <CardEditModal
        isOpen={isCardEditModalOpen}
        onRequestClose={closeCardEditModal}
        onSaveCard={handleSaveCard}
        cardToEdit={editingCard}
      />
      <RenameModal
        isOpen={isListRenameModalOpen}
        onRequestClose={() => setIsListRenameModalOpen(false)}
        onSave={handleUpdateList}
        title="Renomear Lista"
        currentName={listToRename?.name || ''}
      />
      {/* 7. Renderizamos o novo modal de partilha */}
      <ShareModal
        isOpen={isShareModalOpen}
        onRequestClose={() => setIsShareModalOpen(false)}
        board={boardData}
        onBoardUpdate={fetchBoardDetails}
      />
    </>
  );
}