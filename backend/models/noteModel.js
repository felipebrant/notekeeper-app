    import mongoose from 'mongoose';

    const noteSchema = mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        title: {
          type: String,
          required: false,
        },
        content: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          default: '#FFFFFF',
        },
        isPinned: {
          type: Boolean,
          default: false,
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }]
      },
      {
        timestamps: true,
      }
    );

    const Note = mongoose.model('Note', noteSchema);

    export default Note;
    