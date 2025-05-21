"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  BarChart3, 
  ArrowLeft,
  Star, 
  Edit, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Building, 
  User,
  MapPin,
  Globe,
  Clock,
  Tag,
  AlertTriangle,
  MessageSquare,
  Check,
  Plus,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


// Helper functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

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

export default function LeadDetailPage() {
  const params = useParams();
  console.log('Params:', params);
  const leadId = params.id;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(`/api/leads/${leadId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lead');
        }
        const data = await response.json();
        setLead(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Lead Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "The lead you're looking for doesn't exist or has been removed."}</p>
        <Button asChild>
          <Link href="/leads">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{lead.name}</h1>
        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <p>{lead.email || 'N/A'}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p>{lead.phone || 'N/A'}</p>
            </div>
            <div>
              <Label>Company</Label>
              <p>{lead.company || 'N/A'}</p>
            </div>
            <div>
              <Label>Priority</Label>
              <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
            </div>
            <div>
              <Label>Website</Label>
              <p>{lead.website || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <p className="whitespace-pre-wrap">{lead.notes || 'No notes available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
