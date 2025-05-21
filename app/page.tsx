"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Users, Calculator, Calendar, ArrowUpRight, BellRing } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentLeadsTable } from '@/components/RecentLeadsTable';
import { RecentActivity } from '@/components/RecentActivity';
import { LeadsPieChart } from '@/components/LeadsPieChart';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <BarChart3 className="h-6 w-6" />
            <span>CRM-AI</span>
          </div>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            <Link href="/leads" className="text-sm font-medium hover:text-primary transition-colors">
              Leads
            </Link>
            <Link href="/leads/new" className="text-sm font-medium hover:text-primary transition-colors">
              New Lead
            </Link>
            <Button variant="outline" size="icon" className="rounded-full">
              <BellRing className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back. Here is an overview of your CRM today.</p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 high priority</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Your most recently added leads.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentLeadsTable />
                </CardContent>
                <CardFooter>
                  <Link href="/leads">
                    <Button variant="outline" size="sm" className="gap-1">
                      View all
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status Distribution</CardTitle>
                  <CardDescription>Breakdown of leads by status.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <LeadsPieChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your lead management performance over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and interactions with leads.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}