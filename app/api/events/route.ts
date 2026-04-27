/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user's local events from DB
    const localEvents = await prisma.event.findMany({
      where: { userId: session.user.id }
    });

    // 2. Fetch the user's account to get the Google access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "google"
      }
    });

    let googleEventsData: any[] = [];

    if (account?.access_token) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: account.access_token });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      // Get events from primary calendar
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), // Last 1 month
        timeMax: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), // Next 3 months
        maxResults: 100,
        singleEvents: true,
        orderBy: "startTime"
      });

      if (response.data.items) {
        googleEventsData = response.data.items.map(item => ({
          id: item.id,
          title: item.summary || "Busy",
          start: new Date(item.start?.dateTime || item.start?.date || new Date()),
          end: new Date(item.end?.dateTime || item.end?.date || new Date()),
          allDay: !item.start?.dateTime,
          color: "#ea4335", // Google Red to distinguish
          description: item.description,
          source: "google"
        }));
      }
    }

    // Map local events to match frontend interface
    const mappedLocalEvents = localEvents.map(event => ({
      ...event,
      source: "local"
    }));

    return NextResponse.json([...mappedLocalEvents, ...googleEventsData]);
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, start, end, allDay, color, description } = await req.json();

    const event = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay || false,
        color: color || "#3b82f6",
        description,
        userId: session.user.id
      }
    });

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
