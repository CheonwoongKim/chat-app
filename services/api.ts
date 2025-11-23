import { Conversation, ChatMessage } from '@/types/conversation';

// 대화 목록 조회
export async function fetchConversations(
  userEmail: string,
  agentId: string
): Promise<Conversation[]> {
  const response = await fetch(
    `/api/conversations?userEmail=${encodeURIComponent(userEmail)}&agentId=${agentId}`
  );

  if (!response.ok) {
    throw new Error('대화 목록 조회에 실패했습니다.');
  }

  return response.json();
}

// 새 대화 생성
export async function createConversation(
  userEmail: string,
  agentId: string,
  title: string = '새 대화'
): Promise<Conversation> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail,
      agentId,
      title,
    }),
  });

  if (!response.ok) {
    throw new Error('대화 생성에 실패했습니다.');
  }

  return response.json();
}

// 대화 제목 수정
export async function updateConversationTitle(
  conversationId: number,
  title: string
): Promise<Conversation> {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('대화 제목 수정에 실패했습니다.');
  }

  return response.json();
}

// 대화 삭제
export async function deleteConversation(conversationId: number): Promise<void> {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('대화 삭제에 실패했습니다.');
  }
}

// 메시지 조회
export async function fetchMessages(conversationId: number): Promise<ChatMessage[]> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`);

  if (!response.ok) {
    throw new Error('메시지 조회에 실패했습니다.');
  }

  return response.json();
}

// 메시지 저장
export async function saveMessage(
  conversationId: number,
  role: 'user' | 'assistant',
  content: string,
  sources?: any[]
): Promise<ChatMessage> {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role,
      content,
      sources: sources || null,
    }),
  });

  if (!response.ok) {
    throw new Error('메시지 저장에 실패했습니다.');
  }

  return response.json();
}
