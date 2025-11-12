import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function CommentSection({ card, boardId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const getToken = () => localStorage.getItem('token');

  // 1. Função para buscar os comentários deste cartão
  const fetchComments = useCallback(async () => {
    if (!card?._id) return;
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Usamos a API que testámos no Postman!
      const { data } = await axios.get(
        `http://localhost:5000/api/comments/${card._id}`,
        config
      );
      setComments(data);
    } catch (err) {
      console.error('Falha ao buscar comentários', err);
    }
    setIsLoading(false);
  }, [card?._id]);

  // Busca os comentários quando o componente carregar
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 2. Função para criar um novo comentário
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };
      // Usamos a API que testámos no Postman!
      const { data: createdComment } = await axios.post(
        'http://localhost:5000/api/comments',
        {
          content: newComment,
          cardId: card._id,
          boardId: boardId,
        },
        config
      );
      
      // Adiciona o novo comentário à lista (com os dados do 'user' atual)
      setComments([...comments, { ...createdComment, user: { name: user.name } }]);
      setNewComment(''); // Limpa a caixa de texto
    } catch (err) {
      console.error('Falha ao criar comentário', err);
    }
  };

  return (
    <div className="comment-section">
      <h4 className="comment-title">Comentários</h4>
      
      {/* Lista de Comentários */}
      <div className="comment-list">
        {isLoading ? (
          <p>A carregar comentários...</p>
        ) : (
          comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <strong>{comment.user?.name || 'Utilizador'}</strong>
                <p>{comment.content}</p>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString('pt-PT', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="comment-empty">Nenhum comentário ainda.</p>
          )
        )}
      </div>

      {/* Formulário para Novo Comentário */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          placeholder="Escreva um comentário..."
          className="modal-textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2} // Mais pequena que a de notas
        />
        <button type="submit" className="button-primary">
          Enviar
        </button>
      </form>
    </div>
  );
}