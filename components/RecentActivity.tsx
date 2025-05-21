"use client";

import { ExternalLink, MessageSquare, UserPlus, FileEdit, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data
const activities = [
  {
    id: '1',
    type: 'email',
    title: 'Email sent to Sarah Johnson',
    description: 'Follow-up about the proposal',
    time: '2 hours ago',
    icon: Mail,
  },
  {
    id: '2',
    type: 'call',
    title: 'Call with Michael Chen',
    description: 'Discussed pricing options',
    time: '5 hours ago',
    icon: Phone,
  },
  {
    id: '3',
    type: 'note',
    title: 'Note added to Emma Williams',
    description: 'Customer requested additional information about services',
    time: '1 day ago',
    icon: FileEdit,
  },
  {
    id: '4',
    type: 'lead',
    title: 'New lead created',
    description: 'James Taylor from Innovate Solutions',
    time: '2 days ago',
    icon: UserPlus,
  },
  {
    id: '5',
    type: 'email',
    title: 'Email received from Olivia Martinez',
    description: 'Questions about implementation timeline',
    time: '3 days ago',
    icon: MessageSquare,
  },
  {
    id: '6',
    type: 'meeting',
    title: 'Meeting scheduled with Global Systems',
    description: 'Product demo with Emma Williams',
    time: '4 days ago',
    icon: ExternalLink,
  },
];

const getActivityColor = (type: string) => {
  const typeMap: Record<string, string> = {
    'email': 'bg-blue-500',
    'call': 'bg-green-500',
    'note': 'bg-yellow-500',
    'lead': 'bg-purple-500',
    'meeting': 'bg-indigo-500',
  };
  
  return typeMap[type] || 'bg-gray-500';
};

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="relative mt-1 flex h-8 w-8 flex-none items-center justify-center">
            <div className={cn("absolute h-full w-0.5 bg-muted", { "hidden": index === activities.length - 1 })} />
            <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full", getActivityColor(activity.type))}>
              <activity.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}