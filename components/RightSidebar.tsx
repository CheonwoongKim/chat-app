'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface RightSidebarProps {
  currentMessages: Message[];
  onLoadConversation: (conversation: Conversation) => void;
}

export default function RightSidebar({ currentMessages, onLoadConversation }: RightSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');

  const saveCurrentConversation = () => {
    if (currentMessages.length === 0) return;

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: currentMessages[0]?.content.slice(0, 30) || '새 대화',
      messages: [...currentMessages],
      lastUpdated: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
  };

  const handleLoadConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    onLoadConversation(conversation);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (selectedConversationId === id) {
      setSelectedConversationId('');
    }
  };

  return (
    <div className="w-64 flex flex-col py-6" style={{ backgroundColor: 'var(--color-background)', borderLeft: '1px solid var(--color-border)' }}>
      {/* 헤더 */}
      <div className="px-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>대화 이력</h2>
        <button
          onClick={saveCurrentConversation}
          disabled={currentMessages.length === 0}
          className="w-full px-4 py-2 text-sm rounded font-semibold transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: currentMessages.length === 0 ? 'var(--color-border)' : 'var(--color-kb-yellow)',
            color: currentMessages.length === 0 ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
            border: 'none',
            cursor: currentMessages.length === 0 ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = '#F5A623';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--color-kb-yellow)';
            }
          }}
        >
          현재 대화 저장
        </button>
      </div>

      {/* 대화 목록 */}
      <div className="flex-1 overflow-y-auto p-3">
        {conversations.length === 0 ? (
          <div className="text-center text-sm mt-8" style={{ color: 'var(--color-text-secondary)' }}>
            <div className="text-4xl mb-2">📝</div>
            <p>저장된 대화가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleLoadConversation(conversation)}
                className="p-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: selectedConversationId === conversation.id ? '#FFE05A' : 'var(--color-white)',
                  border: selectedConversationId === conversation.id ? '2px solid var(--color-kb-yellow)' : '1px solid var(--color-border)',
                  boxShadow: selectedConversationId === conversation.id ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedConversationId !== conversation.id) {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConversationId !== conversation.id) {
                    e.currentTarget.style.backgroundColor = 'var(--color-white)';
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium truncate flex-1" style={{ color: 'var(--color-text-primary)' }}>
                    {conversation.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="ml-2 text-lg leading-none transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    title="삭제"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#D0021B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    💬 {conversation.messages.length}개
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {conversation.lastUpdated.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 안내 */}
      <div className="px-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>💾</span>
          <span>대화를 저장하고 불러올 수 있습니다</span>
        </div>
      </div>
    </div>
  );
}
