import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  type: {
    type: String,
    enum: ['email', 'call', 'meeting', 'video', 'note'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: String, required: true }
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);