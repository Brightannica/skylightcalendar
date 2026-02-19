import { NextResponse } from 'next/server';
import { getEvents, createEvent, deleteEvent, updateEvent } from '@/app/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const events = await getEvents(userId);
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate body
    if (!body.ownerId || !body.title || !body.start || !body.end) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await createEvent({
      title: body.title,
      start: body.start,
      end: body.end,
      ownerId: body.ownerId,
      allDay: body.allDay,
      guests: body.guests || []
    });

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.ownerId) {
       return NextResponse.json({ error: 'Missing ID or OwnerID' }, { status: 400 });
    }

    const event = await updateEvent(body);
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
   const { searchParams } = new URL(req.url);
   const id = searchParams.get('id');
   const userId = searchParams.get('userId');

   if (!id || !userId) {
     return NextResponse.json({ error: 'Missing ID or UserID' }, { status: 400 });
   }

   try {
     const success = await deleteEvent(id, userId);
     if (success) {
       return NextResponse.json({ success: true });
     } else {
       return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
     }
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
