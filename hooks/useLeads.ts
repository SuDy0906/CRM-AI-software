// hooks/useLeads.ts
import { useState, useEffect } from 'react';
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
  conversation?: {
    message: string;
    timestamp: Date;
  }[];
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads');
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  const updateLead = (updatedLead: any) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );
  };

  return { leads, setLeads, updateLead };
};
