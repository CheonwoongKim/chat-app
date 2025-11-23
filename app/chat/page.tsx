'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@/types/chat';
import { DEFAULT_AGENT, getAgent } from '@/config/agents';
import LeftSidebar from '@/components/LeftSidebar';
import ChatArea from '@/components/ChatArea';
import RightSidebar from '@/components/RightSidebar';
import { MenuIcon } from '@/components/icons';
import { createConversation, fetchMessages } from '@/services/api';
import { ChatMessage } from '@/types/conversation';

export default function ChatPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<string>(DEFAULT_AGENT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const hasCreatedInitialConversation = useRef(false);

  // 인증 확인 및 사용자 정보 로드
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      const userData = JSON.parse(user);
      setUserEmail(userData.email);
    }
  }, [router]);

  // 대화 세션 생성 함수
  const ensureConversationExists = async () => {
    if (!currentConversationId && userEmail) {
      try {
        const conversation = await createConversation(userEmail, selectedAgent);
        setCurrentConversationId(conversation.id);
        return conversation.id;
      } catch (error) {
        console.error('대화 세션 생성 오류:', error);
        return null;
      }
    }
    return currentConversationId;
  };

  // 에이전트 변경 시 메시지 초기화 및 대화 ID 리셋
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setMessages([]);
    setCurrentConversationId(null); // 대화 ID 초기화 (새 메시지 전송 시 생성됨)
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  // 새 대화 시작
  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  // 대화 이력 클릭 시 해당 대화 로드
  const handleLoadConversation = async (conversationId: number) => {
    try {
      const dbMessages = await fetchMessages(conversationId);

      // DB 메시지를 Message 타입으로 변환
      const loadedMessages: Message[] = dbMessages.map((msg: ChatMessage) => ({
        id: msg.id.toString(),
        type: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        sources: msg.sources || []
      }));

      setMessages(loadedMessages);
      setCurrentConversationId(conversationId);
      setIsHistoryOpen(false);
    } catch (error) {
      console.error('대화 로드 오류:', error);
    }
  };

  // 인증되지 않았으면 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  const agent = getAgent(selectedAgent);

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <LeftSidebar onAgentSelect={handleAgentSelect} />
      <div className="flex-1 flex flex-col">
        {/* 타이틀 바 */}
        <div className="w-full flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)', height: 'var(--title-bar-height)', backgroundColor: 'var(--color-background)', paddingLeft: '32px', paddingRight: '32px' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>{agent.name}</h1>
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="대화 이력"
          >
            <MenuIcon isOpen={isHistoryOpen} />
          </button>
        </div>
        {/* 채팅 영역과 우측 패널 */}
        <div className="flex flex-1">
          <ChatArea
            selectedAgent={selectedAgent}
            messages={messages}
            onNewMessage={handleNewMessage}
            conversationId={currentConversationId}
            ensureConversationExists={ensureConversationExists}
          />
          {isHistoryOpen && (
            <RightSidebar
              userEmail={userEmail}
              agentId={selectedAgent}
              onLoadConversation={handleLoadConversation}
              onNewConversation={handleNewConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
