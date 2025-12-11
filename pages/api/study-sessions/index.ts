import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

async function getUserFromToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    return user;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionDate, notes } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabaseAdmin
      .from('study_sessions')
      .insert([
        {
          exam_id: examId || null,
          user_id: userId,
          session_date: sessionDate,
          notes,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating study session:', error);
    return NextResponse.json({ error: 'Failed to create study session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabaseAdmin
      .from('study_sessions')
      .select('*, exams(name)')
      .eq('user_id', userId)
      .order('session_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch study sessions' }, { status: 500 });
  }
}
