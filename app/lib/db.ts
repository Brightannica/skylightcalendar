import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure DB exists
if (!fs.existsSync(DB_PATH)) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], events: [] }, null, 2));
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, hash this!
  color?: string;
}

export interface Event {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay?: boolean;
  ownerId: string;
  guests?: string[]; // Array of user IDs or emails
}

interface DB {
  users: User[];
  events: Event[];
}

function readDB(): DB {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    return { users: [], events: [] };
  }
}

function writeDB(data: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing DB:", error);
  }
}

// User Operations
export async function findUser(username: string): Promise<User | undefined> {
  const db = readDB();
  return db.users.find(u => u.username === username);
}

export async function createUser(username: string, password?: string): Promise<User> {
  const db = readDB();
  if (db.users.find(u => u.username === username)) {
    throw new Error('User already exists');
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password, // Storing plain text for demo purposes only
    color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

export async function getUsers(): Promise<User[]> {
  const db = readDB();
  return db.users.map(({ password, ...user }) => user); // Exclude password
}

// Event Operations
export async function getEvents(userId: string): Promise<Event[]> {
  const db = readDB();
  // Return events owned by user OR where user is a guest (simple implementation)
  // For "invites", we check if the user is in the guests list.
  // Guests list might store usernames for simplicity in frontend input
  const user = db.users.find(u => u.id === userId);
  const username = user?.username;

  return db.events.filter(e =>
    e.ownerId === userId ||
    (e.guests && (e.guests.includes(userId) || (username && e.guests.includes(username))))
  );
}

export async function createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
  const db = readDB();
  const newEvent: Event = {
    ...eventData,
    id: crypto.randomUUID(),
  };
  db.events.push(newEvent);
  writeDB(db);
  return newEvent;
}

export async function updateEvent(eventData: Event): Promise<Event> {
  const db = readDB();
  const index = db.events.findIndex(e => e.id === eventData.id && e.ownerId === eventData.ownerId);
  if (index !== -1) {
    db.events[index] = { ...db.events[index], ...eventData };
    writeDB(db);
    return db.events[index];
  }
  throw new Error('Event not found or unauthorized');
}

export async function deleteEvent(eventId: string, userId: string): Promise<boolean> {
  const db = readDB();
  const index = db.events.findIndex(e => e.id === eventId && e.ownerId === userId);
  if (index !== -1) {
    db.events.splice(index, 1);
    writeDB(db);
    return true;
  }
  return false;
}
