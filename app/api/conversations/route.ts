import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 대화 목록 조회 (사용자별, 에이전트별)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const agentId = searchParams.get('agentId');

    if (!userEmail) {
      return NextResponse.json(
        { error: '사용자 이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    let query = `
      SELECT
        c.id,
        c.user_email,
        c.agent_id,
        c.title,
        c.created_at,
        c.updated_at,
        COUNT(m.id) as message_count
      FROM conversations c
      LEFT JOIN chat_messages m ON c.id = m.conversation_id
      WHERE c.user_email = $1
    `;

    const params: any[] = [userEmail];

    if (agentId) {
      query += ` AND c.agent_id = $2`;
      params.push(agentId);
    }

    query += `
      GROUP BY c.id
      ORDER BY c.updated_at DESC
      LIMIT 50
    `;

    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('대화 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '대화 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 대화 세션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, agentId, title } = body;

    if (!userEmail || !agentId) {
      return NextResponse.json(
        { error: '사용자 이메일과 에이전트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO conversations (user_email, agent_id, title)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userEmail, agentId, title || '새 대화']
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('대화 생성 오류:', error);
    return NextResponse.json(
      { error: '대화 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
