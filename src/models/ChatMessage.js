import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  selectedTeacherEmail: {
    type: String,
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  time: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
