"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, ArrowLeft, Building, Mail, Phone, User, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("New"); // State to track status
  const [source, setSource] = useState("Website"); // State to track source
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: (document.getElementById("name") as HTMLInputElement).value,
      company: (document.getElementById("company") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      website: (document.getElementById("website") as HTMLInputElement).value,
      address: (document.getElementById("address") as HTMLInputElement).value,
      status, // Use the state value for status
      priority,
      source, // Use the state value for source
      lastContact: (document.getElementById("lastContact") as HTMLInputElement).value ? new Date((document.getElementById("lastContact") as HTMLInputElement).value).toISOString() : null,
      notes: (document.getElementById("notes") as HTMLTextAreaElement).value,
      conversation: [{ message: "Lead created", timestamp: new Date().toISOString() }],
    };
     console.log('Form Data:', formData); // Log the form data for debugging

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/leads');
      } else {
        alert('Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
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
            <Link href="/leads" className="text-sm font-medium hover:text-primary transition-colors">
              Leads
            </Link>
            <Link href="/leads/new" className="text-sm font-medium text-primary underline underline-offset-4">
              New Lead
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex items-center px-4 py-4 md:px-6 border-b">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Lead</h1>
          <p className="text-muted-foreground">Add a new potential customer to your pipeline</p>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
              <CardDescription>
                Enter the details of your new lead. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Smith"
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Company <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Acme Inc."
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="123 Main St, City, Country"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Lead Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={status}
                      onValueChange={(value) => setStatus(value)} // Update state on change
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      Priority <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroup value={priority}
        onValueChange={setPriority} defaultValue="Medium" className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Low" id="priority-low" />
                          <Label htmlFor="priority-low" className="text-sm">Low</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Medium" id="priority-medium" />
                          <Label htmlFor="priority-medium" className="text-sm">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="High" id="priority-high" />
                          <Label htmlFor="priority-high" className="text-sm">High</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">
                    Lead Source <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    required
                    value={source}
                    onValueChange={(value) => setSource(value)} // Update state on change
                  >
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="SocialMedia">Social Media</SelectItem>
                      <SelectItem value="Email">Email Campaign</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Advertisement">Advertisement</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastContact">Last Contacted</Label>
                  <Input
                    type="datetime-local"
                    id="lastContact"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional information about this lead"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" type="button" asChild>
                <Link href="/leads">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Lead'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}