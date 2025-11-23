'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { getAgent } from '@/config/agents';
import { KBLogo } from '@/components/KBLogo';
import { MenuIcon, SendIcon, LinkIcon, ExternalLinkIcon } from '@/components/icons';
import { LOADING_MESSAGES, TIMING } from '@/constants';

interface ChatAreaProps {
  selectedAgent: string;
  messages: Message[];
  onNewMessage: (message: Message) => void;
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
}

export default function ChatArea({ selectedAgent, messages, onNewMessage, isHistoryOpen, onToggleHistory }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = getAgent(selectedAgent);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, TIMING.LOADING_MESSAGE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    onNewMessage(userMessage);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // API 호출
      const response = await fetch(
        `${agent.webhookUrl}?user_input=${encodeURIComponent(userInput)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('API 응답 실패');
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);

      // 다양한 응답 형식 처리
      let content = '';
      if (data.final_answer) {
        content = data.final_answer;
      } else if (data.output) {
        content = data.output;
      } else if (data.answer) {
        content = data.answer;
      } else if (data.message) {
        content = data.message;
      } else if (typeof data === 'string') {
        content = data;
      } else if (data.text) {
        content = data.text;
      } else {
        // 응답에서 답변을 찾을 수 없는 경우
        console.warn('응답에서 답변을 찾을 수 없습니다:', data);
        content = JSON.stringify(data, null, 2);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: content,
        timestamp: new Date(),
        sources: data.sources || []
      };

      onNewMessage(assistantMessage);
    } catch (error) {
      console.error('API 호출 오류:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '죄송합니다. 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        timestamp: new Date(),
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* 타이틀 바 */}
      <div className="w-full flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)', height: 'var(--title-bar-height)', backgroundColor: 'var(--color-background)', paddingLeft: '32px', paddingRight: '32px' }}>
        <h1 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: 0 }}>{agent.name}</h1>
        {!isHistoryOpen && (
          <button
            onClick={onToggleHistory}
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
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto space-y-4" style={{ backgroundColor: 'var(--color-background)', maxWidth: 'var(--chat-max-width)', width: '100%', paddingTop: '24px' }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center" style={{ padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                {agent.title}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {agent.description}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px 0',
                alignItems: 'flex-start',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {message.type === 'assistant' && <KBLogo />}

              {/* 메시지 내용 */}
              <div style={{
                maxWidth: message.type === 'user' ? '70%' : '100%',
                display: 'flex',
                flexDirection: 'column',
                width: message.type === 'assistant' ? '100%' : 'auto'
              }}>
                <div style={{
                  maxWidth: message.type === 'user' ? '100%' : '70%',
                  backgroundColor: message.type === 'user' ? 'var(--color-kb-yellow)' : 'transparent',
                  padding: message.type === 'user' ? '12px 16px' : '0',
                  borderRadius: message.type === 'user' ? 'var(--border-radius-md) 0 var(--border-radius-md) var(--border-radius-md)' : '0'
                }}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                    {message.content}
                  </p>
                </div>

                {/* 출처 문서 */}
                {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div style={{ marginTop: '20px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <LinkIcon />
                      <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: 'bold', margin: 0 }}>
                        참고 문서
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {message.sources.map((source, index) => {
                        const SourceCard = source.url ? 'a' : 'div';
                        return (
                          <SourceCard
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: 'var(--color-white)',
                              border: '1px solid var(--color-border-light)',
                              borderRadius: 'var(--border-radius-lg)',
                              padding: '20px 28px 20px 20px',
                              fontSize: '12px',
                              textDecoration: 'none',
                              cursor: source.url ? 'pointer' : 'default',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                            onMouseEnter={(e) => {
                              if (source.url) {
                                e.currentTarget.style.backgroundColor = 'var(--color-hover-bg)';
                                e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (source.url) {
                                e.currentTarget.style.backgroundColor = 'var(--color-white)';
                                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                              }
                            }}
                          >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{source.fileName}</span>
                              <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                                <span>{source.fileFormat}</span>
                                <span>|</span>
                                <span>페이지: {source.page}</span>
                                <span>|</span>
                                <span>{source.department}</span>
                                <span>|</span>
                                <span>{source.manager}</span>
                              </div>
                            </div>
                            {source.url && <ExternalLinkIcon />}
                          </SourceCard>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 0',
              alignItems: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <KBLogo />
            <div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4" style={{ backgroundColor: 'var(--color-background)', maxWidth: 'var(--chat-max-width)', width: '100%' }}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="업무 관련 궁금한 내용을 물어보세요"
              disabled={isLoading}
              className="w-full transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                height: 'var(--input-height)',
                borderRadius: 'var(--border-radius-lg)',
                paddingLeft: '20px',
                paddingRight: '100px'
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '2px solid var(--color-text-primary)';
                e.currentTarget.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid var(--color-border)';
              }}
            />
            {inputValue.trim() && !isLoading && (
              <button
                type="submit"
                className="absolute transition-all duration-200 flex items-center justify-center"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  right: '16px',
                  top: '16px'
                }}
              >
                <SendIcon />
              </button>
            )}
          </div>
          <div className="flex items-center justify-center text-xs" style={{ color: 'var(--color-text-secondary)', marginTop: '12px', marginBottom: '16px' }}>
            <span>개인정보보호 규정에 따라 본 서비스는 개인정보 입력·전송·저장을 일절 허용하지 않습니다</span>
          </div>
        </form>
      </div>
    </div>
  );
}
