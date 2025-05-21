// app/api/leads/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const lead = await db.collection('leads').findOne({ _id: new ObjectId(params.id) });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Exclude _id from update data
    const { _id, ...updateData } = data;

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
    }

    const result = await db.collection('leads').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after', includeResultMetadata: true }
    );

    console.log('Update result object:', result);

    if (!result || !result.value) {
      console.log('Update failed or lead not found:', result);
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Convert _id ObjectId to string before returning JSON
    const updatedLead = { ...result.value, _id: result.value._id.toString() };

    console.log('Updated lead:', updatedLead);

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('leads').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
