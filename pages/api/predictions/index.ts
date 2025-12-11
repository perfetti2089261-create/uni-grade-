import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

interface Grade {
  grade: number;
}

async function getUserFromToken(token: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
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
    const { examId } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id;    // Fetch all grades for the user
    const supabaseAdmin = getSupabaseAdmin();
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from('grades')
      .select('grade')
      .eq('user_id', userId);

    if (gradesError) throw gradesError;

    if (!grades || grades.length === 0) {
      return NextResponse.json(
        { error: 'No grades found to calculate prediction' },
        { status: 400 }
      );
    }

    // Calculate mean grade
    const meanGrade = 
      grades.reduce((sum: number, g: Grade) => sum + g.grade, 0) / grades.length;

    // Calculate confidence score based on number of grades
    const confidenceScore = Math.min(grades.length / 10, 1.0);

    // Insert prediction
    const { data, error } = await supabaseAdmin
      .from('predictions')
      .insert([
        {
          exam_id: examId || null,
          user_id: userId,
          predicted_grade: parseFloat(meanGrade.toFixed(2)),
          confidence_score: parseFloat(confidenceScore.toFixed(2)),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        ...data[0],
        meanGrade,
        explanation: `Based on your mean grade of ${meanGrade.toFixed(2)}/30`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    );
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

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('predictions')
      .select('*, exams(name)')
      .eq('user_id', userId)
      .order('calculation_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
