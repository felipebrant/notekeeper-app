import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // --- NOVOS CAMPOS DE LIXEIRA ---
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    // --- FIM DOS NOVOS CAMPOS ---
  },
  { timestamps: true }
);

boardSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.members.includes(this.owner)) {
      this.members.push(this.owner);
    }
  }
  next();
});

const Board = mongoose.model('Board', boardSchema);

export default Board;