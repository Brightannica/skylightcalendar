import { NextResponse } from 'next/server';
import { createUser } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // Check if user exists happens inside createUser, throws error if so
    const user = await createUser(username, password);

    // Strip password
    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
