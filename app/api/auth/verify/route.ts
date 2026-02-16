// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    return NextResponse.json({
      authenticated: !!session?.value,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Erro ao verificar sessão' },
      { status: 500 }
    );
  }
}