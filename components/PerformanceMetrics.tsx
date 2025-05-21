"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', newLeads: 40, qualifiedLeads: 24, closed: 11 },
  { name: 'Feb', newLeads: 30, qualifiedLeads: 23, closed: 14 },
  { name: 'Mar', newLeads: 45, qualifiedLeads: 28, closed: 16 },
  { name: 'Apr', newLeads: 50, qualifiedLeads: 32, closed: 19 },
  { name: 'May', newLeads: 65, qualifiedLeads: 41, closed: 22 },
  { name: 'Jun', newLeads: 75, qualifiedLeads: 50, closed: 28 },
  { name: 'Jul', newLeads: 60, qualifiedLeads: 45, closed: 24 },
];

export function PerformanceMetrics() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="newLeads" 
            name="New Leads" 
            stroke="hsl(var(--chart-1))" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="qualifiedLeads" 
            name="Qualified Leads" 
            stroke="hsl(var(--chart-2))" 
          />
          <Line 
            type="monotone" 
            dataKey="closed" 
            name="Closed Deals" 
            stroke="hsl(var(--chart-3))" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}