import { useState, useEffect } from 'react';
import { Conversation } from '@/types/conversation';
import { fetchConversations, deleteConversation } from '@/services/api';

export function useConversations(userEmail: string, agentId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    if (!userEmail || !agentId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchConversations(userEmail, agentId);
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화 목록 로드 오류');
      console.error('대화 목록 로드 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeConversation = async (conversationId: number) => {
    try {
      await deleteConversation(conversationId);
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화 삭제 오류');
      console.error('대화 삭제 오류:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadConversations();
  }, [userEmail, agentId]);

  return {
    conversations,
    isLoading,
    error,
    loadConversations,
    removeConversation,
  };
}
