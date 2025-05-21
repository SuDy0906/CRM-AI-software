// Sample data for the CRM application

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Negotiation' | 'Closed' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  lastContact: string;
  createdAt?: string;
  website?: string;
  address?: string;
  aiSuggestion?: boolean;
  notes?: {
    content: string;
    timestamp: string;
    author: string;
  }[];
  tasks?: {
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface Conversation {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'meeting' | 'video' | 'note';
  title: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface AiSuggestion {
  id: string;
  leadId: string;
  title: string;
  content: string;
  type: 'follow-up' | 'sales-approach' | 'objection-handling' | 'general';
}

// Sample leads data
export const leads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@acmeinc.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    status: 'New',
    lastContact: '2 hours ago',
    priority: 'High',
    website: 'https://acmeinc.com',
    address: '123 Main St, San Francisco, CA',
    aiSuggestion: true,
    notes: [
      {
        content: 'Initial call went well. Sarah is interested in our enterprise plan but needs to discuss with her team.',
        timestamp: '2 hours ago',
        author: 'Alex Rodriguez'
      }
    ],
    tasks: [
      {
        title: 'Send follow-up email with pricing details',
        dueDate: 'Tomorrow',
        completed: false
      },
      {
        title: 'Schedule demo with technical team',
        dueDate: 'Next week',
        completed: false
      }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@techcorp.io',
    phone: '+1 (555) 987-6543',
    company: 'TechCorp',
    status: 'Contacted',
    lastContact: '1 day ago',
    priority: 'Medium',
    aiSuggestion: false,
    notes: [
      {
        content: 'Michael showed interest in our API integration capabilities. Send documentation.',
        timestamp: '1 day ago',
        author: 'Jamie Smith'
      }
    ],
    tasks: [
      {
        title: 'Send API documentation',
        dueDate: 'Today',
        completed: true
      },
      {
        title: 'Follow up on integration questions',
        dueDate: 'Next Tuesday',
        completed: false
      }
    ]
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'e.williams@globalsys.co',
    company: 'Global Systems',
    status: 'Qualified',
    lastContact: '3 days ago',
    priority: 'Medium',
    aiSuggestion: true,
    notes: [
      {
        content: 'Emma is evaluating multiple vendors. We need to emphasize our unique features.',
        timestamp: '3 days ago',
        author: 'Alex Rodriguez'
      }
    ],
    tasks: [
      {
        title: 'Prepare competitive analysis document',
        dueDate: 'Friday',
        completed: false
      }
    ]
  },
  {
    id: '4',
    name: 'James Taylor',
    email: 'james@innovatesol.com',
    phone: '+1 (555) 234-5678',
    company: 'Innovate Solutions',
    status: 'Negotiation',
    lastContact: '5 days ago',
    priority: 'High',
    aiSuggestion: false,
    notes: [
      {
        content: 'Negotiating contract terms. James wants a custom SLA for their enterprise deployment.',
        timestamp: '5 days ago',
        author: 'Jamie Smith'
      }
    ],
    tasks: [
      {
        title: 'Draft custom SLA proposal',
        dueDate: 'Tomorrow',
        completed: false
      },
      {
        title: 'Schedule call with legal team',
        dueDate: 'This week',
        completed: false
      }
    ]
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    email: 'olivia@firstcapital.net',
    company: 'First Capital',
    status: 'Closed',
    lastContact: '1 week ago',
    priority: 'Low',
    aiSuggestion: false,
    notes: [
      {
        content: 'Deal closed! Olivia signed the annual contract. Implementation starts next month.',
        timestamp: '1 week ago',
        author: 'Alex Rodriguez'
      }
    ],
    tasks: [
      {
        title: 'Send welcome packet',
        dueDate: 'Yesterday',
        completed: true
      },
      {
        title: 'Schedule onboarding call',
        dueDate: 'Next Monday',
        completed: false
      }
    ]
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'david@suntech.org',
    phone: '+1 (555) 876-5432',
    company: 'SunTech Renewable',
    status: 'New',
    lastContact: '1 day ago',
    priority: 'Medium',
    aiSuggestion: true
  },
  {
    id: '7',
    name: 'Sophia Lee',
    email: 'sophia@cloudserve.co',
    company: 'CloudServe',
    status: 'Qualified',
    lastContact: '6 days ago',
    priority: 'High',
    aiSuggestion: false
  },
  {
    id: '8',
    name: 'Thomas Brown',
    email: 'tbrown@healthplus.org',
    company: 'HealthPlus',
    status: 'Contacted',
    lastContact: '2 days ago',
    priority: 'Medium',
    aiSuggestion: false
  },
  {
    id: '9',
    name: 'Isabella Garcia',
    email: 'isabella@fashionforward.com',
    company: 'Fashion Forward',
    status: 'Lost',
    lastContact: '2 weeks ago',
    priority: 'Low',
    aiSuggestion: false
  },
  {
    id: '10',
    name: 'Ethan Davis',
    email: 'ethan@modernfinance.net',
    company: 'Modern Finance',
    status: 'Negotiation',
    lastContact: '4 days ago',
    priority: 'High',
    aiSuggestion: true
  }
];

// Sample conversation data
const conversations: Conversation[] = [
  {
    id: 'c1',
    leadId: '1',
    type: 'call',
    title: 'Initial discovery call',
    content: 'Discussed company needs and pain points. Sarah expressed interest in our enterprise solution, particularly the automation features. She needs to discuss with her engineering team before moving forward.',
    timestamp: '2 hours ago',
    author: 'Alex Rodriguez'
  },
  {
    id: 'c2',
    leadId: '1',
    type: 'email',
    title: 'Follow-up email with materials',
    content: 'Sent product brochure, case studies, and pricing sheet as requested during our call.',
    timestamp: '1 hour ago',
    author: 'Alex Rodriguez'
  },
  {
    id: 'c3',
    leadId: '2',
    type: 'meeting',
    title: 'Product demo meeting',
    content: 'Demonstrated core platform features. Michael showed particular interest in our API capabilities and asked several technical questions.',
    timestamp: '1 day ago',
    author: 'Jamie Smith'
  },
  {
    id: 'c4',
    leadId: '3',
    type: 'email',
    title: 'Proposal sent',
    content: 'Sent customized proposal based on our previous discussions. Highlighted our unique value propositions compared to competitors.',
    timestamp: '3 days ago',
    author: 'Alex Rodriguez'
  },
  {
    id: 'c5',
    leadId: '4',
    type: 'call',
    title: 'Contract negotiation call',
    content: 'Discussed contract terms. James requested modifications to the SLA to accommodate their 24/7 operations.',
    timestamp: '5 days ago',
    author: 'Jamie Smith'
  },
  {
    id: 'c6',
    leadId: '5',
    type: 'email',
    title: 'Contract signed',
    content: 'Received signed contract from Olivia. Implementation scheduled to begin next month.',
    timestamp: '1 week ago',
    author: 'Alex Rodriguez'
  },
  {
    id: 'c7',
    leadId: '1',
    type: 'note',
    title: 'Internal note',
    content: 'Sarah might be interested in our new analytics module. Should mention this in our next conversation.',
    timestamp: '30 minutes ago',
    author: 'Alex Rodriguez'
  }
];

// Sample AI suggestions data
const aiSuggestions: AiSuggestion[] = [
  {
    id: 's1',
    leadId: '1',
    title: 'Follow-up suggestion',
    content: 'Sarah previously mentioned Q2 budget planning. Now would be a good time to follow up since they are likely finalizing budgets for next quarter.',
    type: 'follow-up',
  },
  {
    id: 's2',
    leadId: '1',
    title: 'Objection handling',
    content: 'Based on past conversations, Sarah might raise concerns about implementation time. Prepare to address this by highlighting our onboarding team\'s success with similar-sized companies.',
    type: 'objection-handling'
  },
  {
    id: 's3',
    leadId: '1',
    title: 'Sales approach',
    content: 'Sarah\'s LinkedIn activity shows her company recently announced expansion plans. This is an opportunity to discuss how our solution scales with their growth.',
    type: 'sales-approach'
  },
  {
    id: 's4',
    leadId: '3',
    title: 'Competitive advantage',
    content: 'Emma is evaluating multiple vendors. Emphasize our unique data security features, which are superior to our main competitor she mentioned (DataSecure).',
    type: 'sales-approach'
  },
  {
    id: 's5',
    leadId: '3',
    title: 'Case study recommendation',
    content: 'Share the FinTech Solutions case study, as their implementation challenges were similar to what Global Systems might face.',
    type: 'follow-up'
  },
  {
    id: 's6',
    leadId: '6',
    title: 'Industry-specific approach',
    content: 'SunTech operates in the renewable energy sector, which has specific compliance requirements. Highlight our compliance reporting features in your next conversation.',
    type: 'sales-approach'
  },
  {
    id: 's7',
    leadId: '10',
    title: 'Discount strategy',
    content: 'Based on negotiation patterns, Ethan might be expecting a volume discount. Instead of reducing price, consider offering the premium support package at no additional cost for the first year.',
    type: 'negotiation'
  }
];

// Helper functions to get data
export function getConversations(leadId: string): Conversation[] {
  return conversations
    .filter(conversation => conversation.leadId === leadId)
    .sort((a, b) => {
      // This is a simplistic sort by timestamp - in a real app, you'd parse the dates properly
      return a.timestamp > b.timestamp ? -1 : 1;
    });
}

export function getAiSuggestions(leadId: string): AiSuggestion[] {
  return aiSuggestions.filter(suggestion => suggestion.leadId === leadId);
}