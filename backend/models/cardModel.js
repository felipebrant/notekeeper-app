import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // No Trello, o título é obrigatório
      trim: true,
    },
    content: {
      type: String,
      default: '', // A descrição longa é opcional
    },
    
    // --- LIGAÇÕES PRINCIPAIS ---
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'List',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Posição do cartão na lista (para a ordem vertical)
    position: {
      type: Number,
      required: true,
    },

    // --- FUNCIONALIDADES REUTILIZADAS DAS NOTAS ---
    color: {
      type: String,
      default: '#FFFFFF',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Adiciona um índice para futuras pesquisas de texto
cardSchema.index({ title: 'text', content: 'text' });

const Card = mongoose.model('Card', cardSchema);

export default Card;