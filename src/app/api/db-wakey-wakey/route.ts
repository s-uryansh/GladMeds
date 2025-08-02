import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/db'; 

export async function GET() {
  try {
    const mongoose = await dbConnect();
    if (!mongoose) {
      throw new Error('Failed to connect to MongoDB: mongoose is null.');
    }
    const db = mongoose.connection.db;
    const collectionName = 'Wakey Wakey';

    if (!db) {
      throw new Error('MongoDB database connection is undefined.');
    }

    const collection = db.collection(collectionName);

    const doc = { message: 'Hello, MongoDB!', createdAt: new Date() };
    const insertResult = await collection.insertOne(doc);

    const foundDocs = await collection.find({}).toArray();
    
    await new Promise(resolve => setTimeout(resolve, 5000));


    await collection.deleteOne({ _id: insertResult.insertedId });

    await db.dropCollection(collectionName);

    return NextResponse.json({
      success: true,
      insertedId: insertResult.insertedId,
      foundDocs,
      message: 'Document processed and collection dropped.'
    });
  } catch (error: any) {
    console.error('DB Service Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
