import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

ReactModal.setAppElement('#root');

// Este é um modal genérico.
// Recebe:
// - isOpen: (boolean) Se está aberto ou fechado
// - onRequestClose: (função) O que fazer ao fechar/cancelar
// - onSave: (função) O que fazer ao clicar em "Guardar"
// - title: (string) O título do modal (ex: "Renomear Quadro")
// - currentName: (string) O nome atual do item a ser editado

export default function RenameModal({
  isOpen,
  onRequestClose,
  onSave,
  title,
  currentName,
}) {
  const [newName, setNewName] = useState(currentName);

  // Este 'useEffect' garante que o campo de texto é
  // atualizado sempre que o modal é aberto com um item diferente.
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onSave(newName); // Envia o novo nome para a função 'onSave'
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel={title}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* CABEÇALHO */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onRequestClose} type="button" className="modal-close-button">
            <FaTimes />
          </button>
        </div>

        {/* CORPO (só tem um campo) */}
        <div className="modal-body-scrollable">
          <input
            type="text"
            placeholder="Insira o novo nome..."
            className="modal-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            required
          />
        </div>

        {/* RODAPÉ (só tem botões) */}
        <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
          <div className="modal-button-group">
            <button
              type="button"
              className="button-secondary"
              onClick={onRequestClose}
            >
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Guardar
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}