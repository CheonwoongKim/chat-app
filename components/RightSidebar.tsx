'use client';

import { useState, useEffect } from 'react';
import { MoreIcon } from '@/components/icons';
import { useConversations } from '@/hooks/useConversations';
import { formatRelativeDate } from '@/utils/date';
import { updateConversationTitle } from '@/services/api';

interface RightSidebarProps {
  userEmail: string;
  agentId: string;
  onLoadConversation: (conversationId: number) => void;
  onNewConversation: () => void;
}

export default function RightSidebar({ userEmail, agentId, onLoadConversation, onNewConversation }: RightSidebarProps) {
  const { conversations, isLoading, removeConversation, loadConversations } = useConversations(userEmail, agentId);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openMenuId]);

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm('이 대화를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await removeConversation(conversationId);
      setOpenMenuId(null);
    } catch (error) {
      alert('대화 삭제에 실패했습니다.');
    }
  };

  const handleStartEdit = (conversationId: number, currentTitle: string) => {
    setEditingId(conversationId);
    setEditTitle(currentTitle);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (conversationId: number) => {
    if (!editTitle.trim()) {
      alert('대화 제목을 입력해주세요.');
      return;
    }

    try {
      await updateConversationTitle(conversationId, editTitle);
      await loadConversations();
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      alert('대화 제목 수정에 실패했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const toggleMenu = (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === conversationId ? null : conversationId);
  };

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      height: '100%',
      backgroundColor: 'var(--color-background)',
      borderLeft: '1px solid var(--color-border)',
      padding: '24px 16px',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>
            대화 이력
          </h3>
        </div>
        <button
          onClick={onNewConversation}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: 'var(--color-text-primary)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          + 새 대화
        </button>
      </div>

      {isLoading ? (
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          로딩 중...
        </p>
      ) : conversations.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          아직 대화 이력이 없습니다.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-white)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              {editingId === conversation.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(conversation.id);
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-md)',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '4px 12px',
                        fontSize: '11px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius-md)',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSaveEdit(conversation.id)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '11px',
                        backgroundColor: 'var(--color-text-primary)',
                        border: 'none',
                        borderRadius: 'var(--border-radius-md)',
                        cursor: 'pointer',
                        color: 'var(--color-white)'
                      }}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onLoadConversation(conversation.id)}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {conversation.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      {formatRelativeDate(conversation.updated_at)}
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => toggleMenu(conversation.id, e)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title="더보기"
                    >
                      <MoreIcon />
                    </button>
                    {openMenuId === conversation.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          marginTop: '4px',
                          backgroundColor: 'var(--color-white)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--border-radius-md)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          zIndex: 10,
                          minWidth: '140px'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conversation.id, conversation.title);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            fontSize: '12px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: 'var(--color-text-primary)',
                            borderBottom: '1px solid var(--color-border)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          이름 변경하기
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            fontSize: '12px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: '#c33'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
