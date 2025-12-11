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
    const { examId, grade, dateTaken, notes } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);
    
    if (!user) {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabaseAdmin
      .from('grades')
      .insert([
        {
          exam_id: examId,
          grade,
          date_taken: dateTaken,
          notes,
          user_id: userId,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    return NextResponse.json(
      { error: 'Failed to create grade' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header in GET');
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);
    
    if (!user) {
      console.error('Invalid token in GET');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id;

    const { data, error } = await supabaseAdmin
      .from('grades')
      .select('*, exams(name, course_code)')
      .eq('user_id', userId)
      .order('date_taken', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}
