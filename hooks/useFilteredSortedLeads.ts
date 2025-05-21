// hooks/useFilteredSortedLeads.ts
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

interface TimeMap {
  [key: string]: number;
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

  const timeMap: TimeMap = {
    hours: 1,
    day: 24,
    days: 24,
    week: 168,
    weeks: 168,
    month: 720,
    months: 720,
  };

  const getTimeValue = (timeStr: string): number => {
    const parts = timeStr.split(' ');
    const num = parseInt(parts[0]);
    const unit = parts[1];
    return num * (timeMap[unit] || 1);
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'lastContact') {
      const numValA = getTimeValue(a.lastContact);
      const numValB = getTimeValue(b.lastContact);
      return sortDirection === 'asc' ? numValA - numValB : numValB - numValA;
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

    let valA =
      sortBy === 'name'
        ? a.name
        : sortBy === 'company'
        ? a.company
        : sortBy === 'email'
        ? a.email
        : '';
    let valB =
      sortBy === 'name'
        ? b.name
        : sortBy === 'company'
        ? b.company
        : sortBy === 'email'
        ? b.email
        : '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  return sortedLeads;
};
