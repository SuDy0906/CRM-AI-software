import mongoose from 'mongoose';

const AiSuggestionSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['follow-up', 'sales-approach', 'objection-handling', 'general'],
    required: true
  }
});

export default mongoose.models.AiSuggestion || mongoose.model('AiSuggestion', AiSuggestionSchema);