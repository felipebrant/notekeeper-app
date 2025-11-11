import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove espaços em branco extras
    },
    // O dono do quadro
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // A lista de utilizadores que podem aceder a este quadro
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true } // Adiciona createdAt e updatedAt
);

// Lógica de "Middleware" do Mongoose:
// Antes de um novo quadro ser guardado ('save'),
// vamos garantir que o dono (owner) é também o primeiro membro.
boardSchema.pre('save', function (next) {
  if (this.isNew) {
    // Verifica se a lista de membros já não o inclui (por segurança)
    if (!this.members.includes(this.owner)) {
      this.members.push(this.owner);
    }
  }
  next(); // Continua a operação de guardar
});

const Board = mongoose.model('Board', boardSchema);

export default Board;