import { NextResponse } from 'next/server';
import { findUser } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = await findUser(username);

    if (!user || user.password !== password) {
       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Don't send password back
    const { password: _, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
