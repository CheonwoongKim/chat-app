import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 특정 대화의 메시지 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = id;

    const result = await pool.query(
      `SELECT * FROM chat_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('메시지 조회 오류:', error);
    return NextResponse.json(
      { error: '메시지 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메시지 저장
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = id;
    const body = await request.json();
    const { role, content, sources } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: 'role과 content가 필요합니다.' },
        { status: 400 }
      );
    }

    // 메시지 저장
    const messageResult = await pool.query(
      `INSERT INTO chat_messages (conversation_id, role, content, sources)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversationId, role, content, sources ? JSON.stringify(sources) : null]
    );

    // 대화 updated_at 업데이트
    await pool.query(
      `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [conversationId]
    );

    return NextResponse.json(messageResult.rows[0]);
  } catch (error) {
    console.error('메시지 저장 오류:', error);
    return NextResponse.json(
      { error: '메시지 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
