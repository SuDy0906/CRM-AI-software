"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoreHorizontal, ArrowUpRight, MessageSquare, Edit } from 'lucide-react';
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConversationLogModal } from './ConversationLogModal';
import EditLeadModal from './EditLeadModal';
import { useLeads } from '@/hooks/useLeads';
import { useTimeAgo } from '@/hooks/useTimeAgo';
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

export function RecentLeadsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [conversationModalOpen, setConversationModalOpen] = useState(false);
  const { leads, updateLead } = useLeads();
  const {getTimeAgo} = useTimeAgo();



  const sortedLeads = [...leads].sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime());
  const topLeads = sortedLeads.slice(0, 5);
  

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topLeads.map(lead => (
            <TableRow key={(lead._id).toString()} className="group hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.company}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                  {lead.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {getTimeAgo(lead.lastContact)}
                </span>
              </TableCell>
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
