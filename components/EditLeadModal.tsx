'use client';

import { Dialog } from '@headlessui/react';
import { X, Mail, Phone, Globe, MapPin, Building2, User } from 'lucide-react';
import { useState } from 'react';
import { ObjectId } from 'mongodb';

interface Lead {
    _id: ObjectId;
    name: string;
    company: string;
    email: string;
    status: string;
    priority: string;
    lastContact: string;
    aiSuggestion?: boolean;
    phone: string;
    website?: string;
    address?: string;
    source?: string;
    notes?: string;
}

interface EditLeadModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedLead: Lead) => void;
}

export default function EditLeadModal({ lead, isOpen, onClose, onUpdated }: EditLeadModalProps) {
    const [formData, setFormData] = useState({ ...lead, _id: lead._id.toString() });
    const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${formData._id.toString?.() ?? formData._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdated(data);
        onClose();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" />
      <Dialog.Panel className="relative max-w-3xl w-full bg-white p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X className="h-5 w-5" />
        </button>
        <Dialog.Title className="text-xl font-bold mb-6">Edit Lead</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', name: 'name', icon: <User className="w-4 h-4 text-gray-400" />, required: true },
            { label: 'Company', name: 'company', icon: <Building2 className="w-4 h-4 text-gray-400" />, required: true },
            { label: 'Email', name: 'email', icon: <Mail className="w-4 h-4 text-gray-400" />, required: true },
            { label: 'Phone', name: 'phone', icon: <Phone className="w-4 h-4 text-gray-400" />, required: false },
            { label: 'Website', name: 'website', icon: <Globe className="w-4 h-4 text-gray-400" />, required: false },
            { label: 'Address', name: 'address', icon: <MapPin className="w-4 h-4 text-gray-400" />, required: false },
          ].map(field => (
            <div key={field.name}>
              <label className="text-sm font-medium text-gray-700">{field.label} {field.required && '*'}</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">{field.icon}</span>
                <input
                  name={field.name}
                  value={String(formData[field.name as keyof Lead] ?? '')}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status, Priority, Source */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="">Select Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Priority *</label>
            <div className="flex items-center gap-4 mt-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <label key={level} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={formData.priority === level}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Lead Source *</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
            required
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
