import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Negotiation', 'Closed', 'Lost'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  lastContact: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  website: String,
  address: String,
  notes: String,
  conversation: [{
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  source: {
    type: String,
    enum: ['Email', 'Phone', 'Website', 'Social Media', 'Other'],
    default: 'Other'
  },
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);