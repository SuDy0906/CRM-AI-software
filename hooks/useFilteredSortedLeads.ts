import { ObjectId } from 'mongodb';

interface Lead {
  _id: ObjectId;
  name: string;
  company: string;
  email: string;
  status: string;
  priority: string;
  lastContact: string; // now treated as timestamp (ISO string or number)
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

const statusRank: Record<string, number> = {
  New: 1,
  Contacted: 2,
  FollowUp: 3,
  Converted: 4,
  Lost: 5,
};

const priorityRank: Record<string, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};


export const useFilteredSortedLeads = (
  leads: Lead[],
  searchQuery: string,
  sortBy: string,
  sortDirection: 'asc' | 'desc'
): Lead[] => {
  const filteredLeads = leads.filter((lead) => {
    const searchTermLower = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchTermLower) ||
      lead.company.toLowerCase().includes(searchTermLower) ||
      lead.email.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'lastContact') {
      const timeA = new Date(a.lastContact).getTime();
      const timeB = new Date(b.lastContact).getTime();
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    }

    if (sortBy === 'status') {
      const rankA = statusRank[a.status] ?? 99;
      const rankB = statusRank[b.status] ?? 99;
      return sortDirection === 'asc' ? rankA - rankB : rankB - rankA;
    }

    if (sortBy === 'priority') {
      const rankA = priorityRank[a.priority] ?? 99;
      const rankB = priorityRank[b.priority] ?? 99;
      return sortDirection === 'asc' ? rankA - rankB : rankB - rankA;
    }

    let valA = sortBy === 'name'
      ? a.name
      : sortBy === 'company'
      ? a.company
      : sortBy === 'email'
      ? a.email
      : sortBy === 'status'
      ? a.status
      : sortBy === 'priority'
      ? a.priority
      : '';

    let valB = sortBy === 'name'
      ? b.name
      : sortBy === 'company'
      ? b.company
      : sortBy === 'email'
      ? b.email
      : sortBy === 'status'
      ? b.status
      : sortBy === 'priority'
      ? b.priority
      : '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection === 'asc'
      ? Number(valA) - Number(valB)
      : Number(valB) - Number(valA);
  });

  return sortedLeads;
};
