"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { 
  MoreHorizontal,
  MessageSquare,
  Star,
  Trash2,
  Edit,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import EditLeadModal from './EditLeadModal';
import { ConversationLogModal } from './ConversationLogModal';
import SuggestionBox from './SuggestionBox';
import { ObjectId } from 'mongodb';
import { useLeads } from '@/hooks/useLeads';
import { useFilteredSortedLeads } from '@/hooks/useFilteredSortedLeads';
import { useSelection } from '@/hooks/useSelection';
import { useTimeAgo } from '@/hooks/useTimeAgo';

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
}

interface Column {
  id: string;
  title: string;
  leadIds: string[];
}

const initialColumns: Column[] = [
  { id: 'new', title: 'New', leadIds: [] },
  { id: 'contacted', title: 'Contacted', leadIds: [] },
  { id: 'qualified', title: 'Qualified', leadIds: [] },
  { id: 'negotiation', title: 'Negotiation', leadIds: [] },
  { id: 'closed', title: 'Closed', leadIds: [] },
];

// Helper functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  
  return priorityMap[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

interface KanbanBoardProps {
  searchQuery: string;
}

export function KanbanBoard({ searchQuery }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [conversationModalOpen, setConversationModalOpen] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('lastContact');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { leads, updateLead } = useLeads();
  const sortedLeads = useFilteredSortedLeads(leads, searchQuery, sortBy, sortDirection);
  const { selected, toggle, toggleAll } = useSelection(sortedLeads);
  const { getTimeAgo } = useTimeAgo();

  useEffect(() => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        leadIds: sortedLeads
          .filter(lead => lead.status.toLowerCase() === column.id)
          .map(lead => lead._id.toString())
      }))
    );
  }, [sortedLeads]);

  const filteredColumns = columns.filter(column => column.leadIds.length > 0 || true);
  
  const getColumnBackgroundColor = (columnId: string) => {
    const colorMap: Record<string, string> = {
      'new': 'bg-blue-50 dark:bg-blue-950/30',
      'contacted': 'bg-purple-50 dark:bg-purple-950/30',
      'qualified': 'bg-yellow-50 dark:bg-yellow-950/30',
      'negotiation': 'bg-orange-50 dark:bg-orange-950/30',
      'closed': 'bg-green-50 dark:bg-green-950/30',
    };
    
    return colorMap[columnId] || 'bg-gray-50 dark:bg-gray-800/30';
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newLeadIds = Array.from(sourceColumn.leadIds);
      newLeadIds.splice(source.index, 1);
      newLeadIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        leadIds: newLeadIds,
      };

      setColumns(prevColumns =>
        prevColumns.map(col => (col.id === newColumn.id ? newColumn : col))
      );
    } else {
      // Moving from one column to another
      const sourceLeadIds = Array.from(sourceColumn.leadIds);
      sourceLeadIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        leadIds: sourceLeadIds,
      };

      const destLeadIds = Array.from(destColumn.leadIds);
      destLeadIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        leadIds: destLeadIds,
      };

      setColumns(prevColumns =>
        prevColumns.map(col => {
          if (col.id === newSourceColumn.id) return newSourceColumn;
          if (col.id === newDestColumn.id) return newDestColumn;
          return col;
        })
      );
    }
  };
  

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
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-[1000px]">
          {filteredColumns.map(column => (
            <div key={column.id} className="w-72 flex-shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {column.leadIds.length}
                  </Badge>
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-2 space-y-3 min-h-[500px] ${getColumnBackgroundColor(column.id)} transition-colors`}
                  >
                    {column.leadIds.map((leadId, index) => {
                      const lead = leads.find(l => l._id.toString() === leadId);
                      if (!lead) return null;
                      
                      return (
                        <Draggable key={lead._id.toString()} draggableId={lead._id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`shadow-sm bg-card transition-all ${snapshot.isDragging ? 'shadow-md rotate-2' : ''}`}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {getInitials(lead.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-sm flex items-center">
                                        {lead.name}
                                        {lead.aiSuggestion && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Sparkles className="h-3 w-3 text-yellow-500 ml-1.5" />
                                              </TooltipTrigger>
                                              <TooltipContent side="top">
                                                <p className="font-medium">AI has suggestions</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">{lead.company}</div>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={`${getPriorityColor(lead.priority)}`}>
                                    {lead.priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {lead.email}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last contact: {getTimeAgo(lead.lastContact)}
                                </p>
                              </CardContent>
                              <CardFooter className="p-2 pt-0 flex justify-between">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <div className="flex gap-1">
                                  <Link href={`/leads/${lead._id}`}>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Button>
                                  </Link>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreHorizontal className="h-3.5 w-3.5" />
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
                                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete lead
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardFooter>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>\
  </>
  );
}