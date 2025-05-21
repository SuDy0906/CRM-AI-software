"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowDownAZ,
  ArrowDown,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LeadTable } from '@/components/LeadTable';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from '@/components/ui/tooltip';

export default function LeadsPage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <BarChart3 className="h-6 w-6" />
            <span>CRM-AI</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/leads" className="text-sm font-medium text-primary underline underline-offset-4">
              Leads
            </Link>
            <Link href="/leads/new" className="text-sm font-medium hover:text-primary transition-colors">
              New Lead
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Leads
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full ml-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="sr-only">AI Insights</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">AI Insights Available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
            <p className="text-muted-foreground">Manage and track all your leads in one place.</p>
          </div>
          <Link href="/leads/new">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Lead
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="company">Company</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="priority">Priority</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lastContact">Last Contact</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="sr-only">Sort Direction</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('list')}
              className="transition-all"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List View</span>
            </Button>
            <Button
              variant={view === 'kanban' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('kanban')}
              className="transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Kanban View</span>
            </Button>
          </div>
        </div>
        
        {view === 'list' ? (
          <LeadTable 
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        ) : (
          <KanbanBoard searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}