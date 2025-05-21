"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ObjectId } from 'mongodb';
import EditLeadModal from './EditLeadModal';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  ArrowUpRight, 
  MessageSquare, 
  Star, 
  Trash2, 
  Edit,
  Sparkles,
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator, 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ConversationLogModal } from './ConversationLogModal';
import SuggestionBox from './SuggestionBox';
import { useLeads } from '@/hooks/useLeads';
import { useFilteredSortedLeads } from '@/hooks/useFilteredSortedLeads';
import { useSelection } from '@/hooks/useSelection';
import { useTimeAgo } from '@/hooks/useTimeAgo';

// Helper functions
const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Contacted': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Qualified': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Closed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  return statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  
  return priorityMap[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

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

interface LeadTableProps {
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export function LeadTable({ searchQuery, sortBy, sortDirection }: LeadTableProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [conversationModalOpen, setConversationModalOpen] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const { leads, updateLead } = useLeads();
  const sortedLeads = useFilteredSortedLeads(leads, searchQuery, sortBy, sortDirection);
  const { selected, toggle, toggleAll } = useSelection(sortedLeads);
  const { getTimeAgo } = useTimeAgo();

  return (
    <>
    {currentLead && (
      <EditLeadModal
        lead={currentLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdated={updateLead}
      />
    )}
    {currentLead && (
      <ConversationLogModal
        leadId={currentLead._id.toString()}
        isOpen={conversationModalOpen}
        onClose={() => setConversationModalOpen(false)}
       
      />
    )}
    {currentLead && (<SuggestionBox
  isOpen={showSuggestionModal}
  onClose={() => setShowSuggestionModal(false)}
  leadDetails={currentLead}
  />
    )}

    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selected.length === sortedLeads.length && sortedLeads.length > 0} 
                onCheckedChange={toggleAll}
                aria-label="Select all leads"
              />
            </TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Last Contact</TableHead>
          
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map(lead => (
            <TableRow key={lead._id.toString()} className="group hover:bg-muted/50">
              <TableCell>
                <Checkbox 
                  checked={selected.includes(lead._id.toString())} 
                  onCheckedChange={() => toggle(lead._id.toString())}
                  aria-label={`Select ${lead.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {lead.name}
                      {lead.aiSuggestion && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Sparkles className="h-3.5 w-3.5 text-yellow-500 ml-1.5" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="font-medium">AI has suggestions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.company}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getStatusColor(lead.status)}`}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{getTimeAgo(lead.lastContact)}</span>
              </TableCell>
              {/* <TableCell>
                <span className="text-sm text-muted-foreground">{lead.company}</span>
              </TableCell> */}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Link href={`/leads/${lead._id}`}>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/leads/${lead._id}`} className="cursor-pointer flex w-full items-center">
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setIsModalOpen(true); setCurrentLead(lead); }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit lead
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                        setCurrentLead(lead);
                        setConversationModalOpen(true);
                        }}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Log conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                        setCurrentLead(lead);
                        setShowSuggestionModal(true);
                        }}>
                          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                          View AI suggestions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                        <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={async () => {
                          try {
                          const response = await fetch(`/api/leads/${lead._id}`, {
                            method: 'DELETE',
                          });

                          if (response.ok) {
                            updateLead(lead._id.toString());
                          } else {
                            console.error('Failed to delete lead');
                          }
                          } catch (error) {
                          console.error('Error deleting lead:', error);
                          }
                        }}
                        >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete lead
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  );
}