import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash } from 'react-icons/fa';
// 1. Importamos o nosso novo modal
import RenameModal from '../components/RenameModal';

export default function BoardsDashboardPage({ user }) {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. Novos estados para controlar o modal de renomear
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [boardToRename, setBoardToRename] = useState(null); // Guarda o quadro a ser renomeado

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem('token');

  // --- FUNÇÃO PARA BUSCAR OS QUADROS (Sem alterações) ---
  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data } = await axios.get(
        'http://localhost:5000/api/boards',
        config
      );
      setBoards(data);
      setError('');
    } catch (err) {
      setError('Falha ao carregar os quadros.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // --- FUNÇÃO PARA CRIAR UM NOVO QUADRO (Sem alterações) ---
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      const { data: newBoard } = await axios.post(
        'http://localhost:5000/api/boards',
        { name: newBoardName },
        config
      );
      setBoards([newBoard, ...boards]);
      setNewBoardName('');
    } catch (err) {
      setError('Falha ao criar o quadro.');
      console.error(err);
    }
  };

  // --- FUNÇÃO PARA NAVEGAR (Sem alterações) ---
  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  // --- 3. FUNÇÃO DE EDITAR O NOME DO QUADRO (Modificada) ---
  // Esta função é agora chamada pelo modal 'onSave'
  const handleUpdateBoard = async (newName) => {
    if (!newName || !newName.trim() || !boardToRename || newName === boardToRename.name) {
      setIsRenameModalOpen(false); // Fecha o modal
      setBoardToRename(null);     // Limpa o estado
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Usamos a API (PUT)
      const { data: updatedBoard } = await axios.put(
        `http://localhost:5000/api/boards/${boardToRename._id}`,
        { name: newName },
        config
      );
      // Atualiza a lista de quadros no ecrã
      setBoards(boards.map(b => b._id === boardToRename._id ? updatedBoard : b));
      setIsRenameModalOpen(false); // Fecha o modal
      setBoardToRename(null);     // Limpa o estado
    } catch (err) {
      setError('Falha ao renomear o quadro.');
      console.error(err);
    }
  };
  
  // 4. Nova função para ABRIR o modal
  const openRenameBoardModal = (e, board) => {
    e.stopPropagation(); // Impede que o clique navegue para o quadro
    setBoardToRename(board); // Define qual quadro estamos a editar
    setIsRenameModalOpen(true); // Abre o modal
  };


  // --- FUNÇÃO PARA APAGAR O QUADRO (Sem alterações) ---
  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation();
    if (!window.confirm('Mover este quadro para a lixeira?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      await axios.delete(
        `http://localhost:5000/api/boards/${boardId}`,
        config
      );
      setBoards(boards.filter(b => b._id !== boardId));
    } catch (err) {
      setError('Falha ao mover o quadro para a lixeira.');
      console.error(err);
    }
  };


  return (
    <>
      <div className="dashboard-page">
        <main className="dashboard-container">
          <h2 className="dashboard-title">Meus Quadros</h2>
          <p className="dashboard-subtitle">
            Organize os seus projetos e tarefas.
          </p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleCreateBoard} className="create-board-form">
            <input
              type="text"
              className="modal-input"
              placeholder="Nome do novo quadro..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              required
            />
            <button type="submit" className="button-primary">
              Criar Quadro
            </button>
          </form>

          <hr className="divider" />

          {isLoading ? (
            <p>A carregar quadros...</p>
          ) : (
            <div className="boards-grid">
              {boards.length > 0 ? (
                boards.map((board) => (
                  <div
                    key={board._id}
                    className="board-card"
                    onClick={() => handleBoardClick(board._id)}
                  >
                    <div className="board-card-actions">
                      <button
                        className="board-action-button"
                        title="Renomear Quadro"
                        // 5. O botão de editar agora chama a função para ABRIR o modal
                        onClick={(e) => openRenameBoardModal(e, board)}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="board-action-button"
                        title="Mover para a Lixeira"
                        onClick={(e) => handleDeleteBoard(e, board._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <h3 className="board-card-title">{board.name}</h3>
                  </div>
                ))
              ) : (
                <p>Você ainda não tem quadros. Crie um acima!</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 6. Renderizamos o novo modal */}
      <RenameModal
        isOpen={isRenameModalOpen}
        onRequestClose={() => setIsRenameModalOpen(false)}
        onSave={handleUpdateBoard}
        title="Renomear Quadro"
        currentName={boardToRename?.name || ''}
      />
    </>
  );
}