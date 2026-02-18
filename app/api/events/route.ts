import { google } from 'googleapis';
import { NextResponse } from 'next/server';

function getCalendarClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY as string || '').replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL as string;

  if (!privateKey || !clientEmail) {
    throw new Error("Missing Google Credentials in .env.local");
  }

  const jwtClient = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  
  return google.calendar({ version: 'v3', auth: jwtClient });
}

export async function GET() {
  try {
    const calendar = getCalendarClient();
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return NextResponse.json(response.data.items || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, start, end } = await request.json();
    const calendar = getCalendarClient();
    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: title,
        start: { dateTime: start },
        end: { dateTime: end },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}