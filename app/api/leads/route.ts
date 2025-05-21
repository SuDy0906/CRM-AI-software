// app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('leads');

    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { db } = await connectToDatabase();
    console.log('DB Connection:', db);
    console.log('Request Body:', body);    
    const result = await db.collection('leads').insertOne(body);
    console.log('Inserted lead:', result);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}