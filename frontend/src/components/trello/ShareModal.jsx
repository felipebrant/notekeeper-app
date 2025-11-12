import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';

ReactModal.setAppElement('#root');

export default function ShareModal({
  isOpen,
  onRequestClose,
  board,      // O quadro completo, com 'owner' e 'members'
  onBoardUpdate, // Função para recarregar o quadro após uma mudança
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const getToken = () => localStorage.getItem('token');

  // Função para convidar um novo membro
  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // 1. Usamos a API de convite que testámos no Postman
      await axios.post(
        `http://localhost:5000/api/boards/${board._id}/invite`,
        { email },
        config
      );
      setSuccess(`${email} foi convidado com sucesso!`);
      setEmail('');
      onBoardUpdate(); // Avisa o 'BoardDetailPage' para buscar os dados novamente
    } catch (err) {
      // Pega a mensagem de erro específica do backend
      const message =
        err.response?.data?.message || 'Falha ao convidar o utilizador.';
      setError(message);
      console.error(err);
    }
  };

  // Função para remover um membro
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Tem a certeza que quer remover este membro?')) return;
    
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // 2. Usamos a API de remoção que criámos
      await axios.delete(
        `http://localhost:5000/api/boards/${board._id}/members/${memberId}`,
        config
      );
      setSuccess('Membro removido com sucesso.');
      onBoardUpdate(); // Recarrega os dados
    } catch (err) {
      const message =
        err.response?.data?.message || 'Falha ao remover o membro.';
      setError(message);
      console.error(err);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel="Partilhar Quadro"
    >
      <div className="modal-header">
        <h2>Partilhar Quadro: {board?.name}</h2>
        <button onClick={onRequestClose} className="modal-close-button">
          <FaTimes />
        </button>
      </div>

      <div className="modal-body-scrollable">
        {/* Formulário para Convidar Novo Membro */}
        <form onSubmit={handleInvite} className="share-form">
          <label htmlFor="member-email">Convidar por email</label>
          <div className="share-form-inputs">
            <input
              type="email"
              id="member-email"
              placeholder="email@exemplo.com"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="button-primary">
              Convidar
            </button>
          </div>
          {error && <p className="login-error">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>

        <hr className="divider" />

        {/* Lista de Membros Atuais */}
        <div className="members-list">
          <h4>Membros ({board?.members?.length || 0})</h4>
          {board?.members?.map((member) => (
            <div key={member._id} className="member-item">
              <div className="member-info">
                <strong>{member.name}</strong>
                <span>{member.email}</span>
                {/* Mostra uma "tag" de Dono */}
                {member._id === board.owner._id && (
                  <span className="owner-tag">Dono</span>
                )}
              </div>
              
              {/* Só pode remover se NÃO for o dono */}
              {member._id !== board.owner._id && (
                <button
                  className="tag-delete-button" // Reutilizamos o estilo
                  title="Remover Membro"
                  onClick={() => handleRemoveMember(member._id)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </ReactModal>
  );
}