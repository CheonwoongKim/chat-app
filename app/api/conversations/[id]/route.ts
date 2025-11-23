import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 대화 제목 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = id;
    const { title } = await request.json();

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: '유효한 제목을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 대화 제목 업데이트
    const result = await pool.query(
      'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [title.trim(), conversationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '대화를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('대화 제목 수정 오류:', error);
    return NextResponse.json(
      { error: '대화 제목 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 대화 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversationId = id;

    // 대화 삭제 (CASCADE로 메시지도 함께 삭제됨)
    await pool.query(
      'DELETE FROM conversations WHERE id = $1',
      [conversationId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('대화 삭제 오류:', error);
    return NextResponse.json(
      { error: '대화 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
