'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import { DEFAULT_AGENT } from '@/config/agents';
import LeftSidebar from '@/components/LeftSidebar';
import ChatArea from '@/components/ChatArea';
import { CloseIcon } from '@/components/icons';

export default function ChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<string>(DEFAULT_AGENT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setMessages([]); // 에이전트 변경 시 대화 초기화
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <LeftSidebar onAgentSelect={handleAgentSelect} />
      <ChatArea
        selectedAgent={selectedAgent}
        messages={messages}
        onNewMessage={handleNewMessage}
        isHistoryOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
      />
      {isHistoryOpen && (
        <div style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-background)',
          borderLeft: '1px solid var(--color-border)',
          padding: '24px 16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>
              대화 이력
            </h3>
            <button
              onClick={() => setIsHistoryOpen(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="닫기"
            >
              <CloseIcon />
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            최근 대화 내역이 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
